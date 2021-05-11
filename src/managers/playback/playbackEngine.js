import {playbackActions} from './playback-actions';
import _ from 'lodash'
import deepClone from 'deep-clone'
import {resetModes, resetModesAndPlayback} from '../../util/ModeManager';
import {getActionDefinition} from '../../util/ActionUtils';
import {countReportableActions} from '../../util/TestUtils';
import {RequestAction} from '../../models/Action'
import {ActionsByConstant} from "../../generators/_shared/ActionTruth";
import {saveScreenshot} from "../ScreenshotManager";
import {fullScreenshot, partialScreenshot} from "./playback-utils";
import {combineVarsWith, getEnvVars, getSystemVars, spreadVariables} from "./playback-variables";
import {reportError} from "../../actions/UserActions";

const uuidv4 = require('uuid/v4');


export function playbackEngine(state, events, options) {

  var stack;
  var loopIndex = 0;
  var status;
  var globalVariables;
  var dynamicVars;
  var dataVars;
  var testResult;
  var forceOneToPlay;
  var stackErrorSnapshot;
  var initialTabId;
  var tabIdx = 0;
  var frameStack = [];

  events = _.extend({
    onComplete: _.noop,
    onLoopComplete: _.noop,
    onError: _.noop,
    onPause: _.noop,
    onActionStaged: _.noop,
    onActionProcessing: _.noop,
    onActionResult: _.noop,
    onDestroy: _.noop
  }, events);

  options = _.extend({
    envId: null
  }, options);

  function callStackHead(poppedResult, ignoreBreakpoint) {
    (function executeAction () {

      var subroutine = stack[stack.length - 1];                 // get current frame
      var action = subroutine.actions[subroutine.actionCursor];

      // BASE CASE - no action which indicates end of block, or there's an error being propogated.
      if (!action || (subroutine.propogateError && poppedResult && poppedResult.error)) {
        stack.pop();
        if (!stack[0]) {
          if (poppedResult && poppedResult.error) testResult.error = poppedResult.error;
          return _onComplete();
        }
        else {
          if (poppedResult) return callStackHead(poppedResult);
          else return callStackHead({error: null, returned: true});
        }
      }

      // skip actions that are commented.
      if (action && action.commented) {
        subroutine.actionCursor++;
        return executeAction();
      }

      // skip actions that aren't selected (if there is a selection)
      if (action && state.selectedRows.length > 0 && state.selectedRows.indexOf(action.id) === -1) {
        subroutine.actionCursor++;
        return executeAction();
      }

      // store poppedResult on the action. reset propogateError
      if (!subroutine.propogateError) {
        subroutine.propogateError = true;
        action.result = poppedResult;
        poppedResult = null;
      }

      state.playbackCursor =
        (subroutine.caller && subroutine.caller.type === "COMPONENT") ? subroutine.caller.id + "COMPONENT" + action.id : action.id;

      // handle pausing/breakpoints.
      if ((
          state.playbackBreakpoints.indexOf(action.id) !== -1
            || status === "PAUSING"
            || status === "STEPPING")
          && !forceOneToPlay
          && !action.disablePause // this is mainly set when being executed within a conditional
          && !action.result // don't pause when looping back to a completed action
      ) {
        state.isPlayingBack=false;
        status="PAUSED";
        forceOneToPlay = true;
        events.onPause();
        return;
      } else {
        state.isPlayingBack=true;
      }

      forceOneToPlay = false;

      var then = Date.now();
      _prepResult(action, subroutine);

      events.onActionStaged();

      waitPlaybackInterval(state)
        .then(() => hydrateRequest(action, subroutine))
        .then(() => applyVariables(action, subroutine))
        .then((action) => performAction(action, subroutine, _deriveVariables(subroutine))).then((result) => {

        if (status === "TERMINATED") return;

        var timeElapsed = Date.now() - then;

        if (result) {

          action.result = result;
          events.onActionResult(result);

          if (!result.error || action.continueOnFail) {

            if (!result.skipResult) {
              _reportResult(action, result, timeElapsed, subroutine);
            }

            subroutine.actionCursor++;

            executeAction();

          } else {
            // action error case... pop the previous stack with an error response;
            stackErrorSnapshot = deepClone(stack);
            stack.pop();
            if (!result.skipResult) _reportResult(action, result, timeElapsed, subroutine);
            if (!stack[0]) {
              testResult.error = result.error;
              return _onComplete();
            }
            else return callStackHead({error: result.error, returned: false});
          }

        }
      }).catch((e) => {
        // MAJOR FAILURE
        reportError({
          message: e instanceof Error ? e.stack : e,
          category: "playbackEngine:performAction",
          severity: "CRITICAL"
        }, state);
        resetModesAndPlayback(state);
        events.onError(e.message);
      });

    })()

  }

  var actionDefs = Object.assign({}, playbackActions, {
    "IF": {
      perform: (currentTabId, frameStack, action, state, subroutine) => new Promise((resolve, reject) => {

        var nextScopeAction = getFirstActionOfNextScope(subroutine.testContext, action);

        if (_.isUndefined(action.result)) {
          action.value.disablePause = true;
          stack.push(buildSubroutine(action.value, [action.value], action, subroutine.compVars));
          subroutine.propogateError = false;  // set the flow to recurse to this block
          callStackHead();
        } else {
          if (nextScopeAction && !action.result.error) {
            subroutine.actionCursor++;
            _reportResult(action, action.result, 0, subroutine);
            stack.push(buildSubroutine(nextScopeAction, subroutine.testContext, action, subroutine.compVars));
            callStackHead();
            return resolve();
          } else {
            return resolve({error: null, returned: false});
          }
        }

      })
    },
    "ELSEIF": {
      perform: (currentTabId, frameStack, action, state, subroutine, options) => new Promise((resolve, reject) => {

        // we need to find all ELSEIFs up to and including the most previous IF.
        // We should check each conditional.  if none were true, and this one is true, then trigger the scope

        var mostPreviousIfAction;
        var condActionsToCheck = [];
        var searchCursor = stack[stack.length - 1].actionCursor - 1;

        while (searchCursor >= 0 && !mostPreviousIfAction) {
          if (subroutine.actions[searchCursor].type === "IF") {
            condActionsToCheck.push(subroutine.actions[searchCursor]);
            mostPreviousIfAction = subroutine.actions[searchCursor];
          }
          else if (subroutine.actions[searchCursor].type === "ELSEIF") {
            condActionsToCheck.push(subroutine.actions[searchCursor]);
          }
          searchCursor--;
        }

        var allPrevCondNegative = true;

        condActionsToCheck.forEach((condAction) => {
          if (condAction.result.returned) allPrevCondNegative = false;
        })

        var idxOfAction = findIndexById(subroutine.testContext, action.id);

        if (action.type === "ELSEIF" && allPrevCondNegative) {
          actionDefs["IF"].perform(currentTabId, action, state, subroutine, options).then((result) => resolve(result));
        } else {
          var nextScopeAction = getFirstActionOfNextScope(subroutine.testContext, action);
          if (nextScopeAction && allPrevCondNegative) {
            _reportResult(action, {}, 0, subroutine);
            subroutine.actionCursor++;
            stack.push(buildSubroutine(nextScopeAction, subroutine.testContext, action, subroutine.compVars));
            callStackHead();
          } else {
            resolve({error: null, returned: false});
          }
        }

      })
    },
    "WHILE": {
      perform: (currentTabId, frameStack, action, state, subroutine) => new Promise((resolve, reject) => {

        var nextScopeAction = getFirstActionOfNextScope(subroutine.testContext, action);

        if (action.hasBreak) {
          subroutine.actionCursor++;
          callStackHead();
          return resolve();
        }
        else if (_.isUndefined(action.result)) {
          stack.push(buildSubroutine(action.value, [action.value], action, subroutine.compVars));
          subroutine.propogateError = false;  // set the flow to recurse to this block
          callStackHead();
        } else {
          if (nextScopeAction && !action.result.error) {
            _reportResult(action, action.result, 0, subroutine);
            _deleteResultFromSubRoutine(subroutine, action);
            stack.push(buildSubroutine(nextScopeAction, subroutine.testContext, action, subroutine.compVars));
            callStackHead();
            return resolve();
          } else {
            subroutine.actionCursor++;
            delete action.result;
            callStackHead();
            return resolve();
          }
        }

      })
    },
    "DOWHILE": {
      perform: (currentTabId, frameStack, action, state, subroutine) => new Promise((resolve, reject) => {

        var nextScopeAction = getFirstActionOfNextScope(subroutine.testContext, action);

        if (action.hasBreak) {
          subroutine.actionCursor++;
          callStackHead();
          return resolve();
        }
        else if (!action.hasLooped) {
          if (nextScopeAction) {
            subroutine.actions[subroutine.actionCursor].hasLooped = true;
            subroutine.propogateError = false;  // set the flow to recurse to this block
            stack.push(buildSubroutine(nextScopeAction, subroutine.testContext, action, subroutine.compVars));
            callStackHead();
            return resolve();
          } else {
            callStackHead();
            return resolve();
          }
        } else if (!action.hasCheckedConditional) {

          subroutine.actions[subroutine.actionCursor].hasCheckedConditional = true;
          stack.push(buildSubroutine(action.value, [action.value], action, subroutine.compVars));
          subroutine.propogateError = false;  // set the flow to recurse to this block
          callStackHead();

        } else {

          subroutine.actions[subroutine.actionCursor].hasCheckedConditional = false;
          subroutine.actions[subroutine.actionCursor].hasLooped = false;

          if (!action.result.error && nextScopeAction) {
            _reportResult(action, action.result, 0, subroutine);
            _deleteResultFromSubRoutine(subroutine, action);
            stack.push(buildSubroutine(nextScopeAction, subroutine.testContext, action, subroutine.compVars));
            callStackHead();
            return resolve();
          } else {
            subroutine.actionCursor++;
            delete action.result;
            callStackHead();
            return resolve();
          }

        }

      })
    },
    "BREAK": {
      perform: (currentTabId, frameStack, action, state, subroutine) => new Promise((resolve, reject) => {
        // find the latest stack with actionCursor on a TRY loop.  pop the stack to this and call stack head.

        var subroutineIndex = stack.length - 1;
        var targetSubroutine;

        while (stack[subroutineIndex]) {

          var thisSubroutine = stack[subroutineIndex];
          var thisAction = thisSubroutine.actions[thisSubroutine.actionCursor];

          if (thisAction.type === "WHILE" || thisAction.type === "DOWHILE") {
            targetSubroutine = thisSubroutine;
            break;
          }

          subroutineIndex--;
        }

        if (targetSubroutine) {
          thisAction.hasBreak = true;
          stack = stack.slice(0, subroutineIndex + 1);
          callStackHead();
        }

        return resolve();

      })
    },
    "COMPONENT": {
      perform: (currentTabId, frameStack, action, state, subroutine) => new Promise((resolve, reject) => {

        var compIdx = findIndexById(state.components, action.componentId);
        var comp = state.components[compIdx];

        if (comp && comp.actions[0]) {
          subroutine.actionCursor++;
          var compVars = buildCompInstanceVars(comp, action);
          stack.push(buildSubroutine(deepClone(comp.actions[0]), deepClone(comp.actions), action, compVars));
          callStackHead();
          return resolve();
        } else {
          return resolve({error: null, returned: false});
        }

      })
    },
    "CATCH": {
      perform: (currentTabId, frameStack, action, state, subroutine) => new Promise((resolve, reject) => {
        return resolve({error: null, returned: true, skipResult: true});
      })
    },
    "GOTO": {
      perform: (currentTabId, frameStack, action, state, subroutine) => new Promise((resolve, reject) => {

        // we need to find the action in the stack, pop the stack to that window.

        var subroutineWithActionIdx = -1;
        var indexOfAction = -1;

        stack.forEach((subroutine, idx) => {
          for (var i = 0; i < subroutine.actions.length; i++) {
            if (subroutine.actions[i].id === action.value) {
              subroutineWithActionIdx = idx;
              indexOfAction = i;
            }
          }
        })

        if (subroutineWithActionIdx > -1 && indexOfAction > -1) {
          stack[subroutineWithActionIdx].actionCursor = indexOfAction;
          stack = stack.slice(0, subroutineWithActionIdx + 1);
        }

        callStackHead();

        resolve();

      })
    },
    "TRY": {
      perform: (currentTabId, frameStack, action, state, subroutine) => new Promise((resolve, reject) => {

        var idxOfAction = findIndexById(subroutine.testContext, action.id);

        if (_.isUndefined(action.result)) {

          var nextAction = subroutine.testContext[idxOfAction + 1];
          if (nextAction) {
            subroutine.propogateError = false;  // let this loop back around so we can check for a catch clause.
            stack.push(buildSubroutine(nextAction, subroutine.testContext, action, subroutine.compVars));
            callStackHead();
            return resolve();
          } else {
            return resolve({error: null, returned: true, skipResult: true});
          }
        } else {

          if (action.result.error) {

            var catchClause = findOneNextInScope(subroutine.actions, action, "CATCH");

            if (catchClause) {
              subroutine.actionCursor++;
              var nextScopeAction = getFirstActionOfNextScope(subroutine.testContext, catchClause);
              stack.push(buildSubroutine(nextScopeAction, subroutine.testContext, action, subroutine.compVars));
              callStackHead();
            } else {
              return resolve({error: null, returned: true, skipResult: true});
            }
          } else {
            return resolve({error: null, returned: true, skipResult: true});
          }
        }

      })
    }
  });

  function _generateGlobalVars() {
    return {
      random1: parseInt(Math.random() * 10000000),
      random2: parseInt(Math.random() * 10000000),
      random3: parseInt(Math.random() * 10000000)
    };
  }

  function _reset() {
    resetModesAndPlayback(state);
    status = "RUNNING";
    stack = [];
    testResult = {
      name: state.activeTest ? state.activeTest.name : "",
      testId: state.activeTest ? state.activeTest.id : null,
      duration: 0,
      results: [],
      time: Date.now(),
      error: null
    };
    globalVariables = _generateGlobalVars();
    dynamicVars = {};
    dataVars = {};
    tabIdx = 0;
    initialTabId = state.currentTabId;
  }

  function _deleteResultFromSubRoutine(subroutine, action) {
    var subAction = _.find(subroutine.actions, {id: action.id});
    delete subAction.result;
    delete action.result;
  }

  function buildCompInstanceVars(component, action) {
    // Gather component default and instance variable
    var instanceCompVars = [];

    // get default comp vars.
    var defaultCompVars = component.variables.map((compVar) => ({key: compVar.name, value: compVar.defaultValue }));

    // apply the specific component instance variables next
    action.variables.forEach((instanceVar) => {
      var varName = _.find(component.variables, {id: instanceVar.id});
      if (varName && instanceVar.value !== "${default}") instanceCompVars.push({key: varName.name, value: instanceVar.value});
    });

    return {
      default: defaultCompVars,
      instance: instanceCompVars
    }

  }

  function _deriveVariables(subroutine) {

    // We deal with arrays here to maintain the order of variables.
    var system = getSystemVars(globalVariables);
    var testVars = state.activeTest.variables.map((testVar) => ({key: testVar.name, value: testVar.defaultValue}));
    var compDefaultVars = subroutine.compVars ? subroutine.compVars.default : [];
    var envVars = getEnvVars(state.dataProfiles, state.selectedProfile, options);


    // Environment variables only combing with themselves and system.
    envVars = combineVarsWith(envVars, system);
    envVars = combineVarsWith(envVars, envVars, false);

    // Test vars combing with system, env vars
    testVars = combineVarsWith(testVars, system);
    testVars = combineVarsWith(testVars, testVars, false);

    // Test vars combing with system, env vars
    compDefaultVars = combineVarsWith(compDefaultVars, system);
    compDefaultVars = combineVarsWith(compDefaultVars, compDefaultVars, false);

    // extend the variables in the correct order
    var variables = Object.assign(
      spreadVariables(system),  // system
      spreadVariables(testVars),
      spreadVariables(compDefaultVars),
      spreadVariables(envVars),
      subroutine.compVars ? spreadVariables(subroutine.compVars.instance) : {},
      dataVars,
      dynamicVars
    );

    return variables;
  }

  function hydrateRequest(action, subroutine) {
    if (action.type === "REQUEST" && action.reqId) {
      var request = _.find(state.tests, {id: action.reqId});
      if (request) action.request = deepClone(request);
    }
    return action;
  }

  function applyVariables(action, subroutine) {
    var variables = _deriveVariables(subroutine);
    for (var i in variables) _applyVarToAction(action, i, variables[i]);
    return applyEvals(action, variables);
  }

  function _extendVarsWithEachother(variables) {

    variables = variables.slice(0);

    variables.forEach((variable) => {

      variables.forEach((replacer) => {
        var myRegEx = new RegExp(`\\$\\{${replacer.name}\\}`, "g");
        variable.value = variable.value.replace(myRegEx, replacer.value);
      });

    });

    return variables;

  }

  function _getCurrentTabId() {
    if (tabIdx === 0) {
      return initialTabId;
    } else if (state.activeTabs[tabIdx]) {
      return state.activeTabs[tabIdx];
    }
  }

  function _hasEvalVars(action) {

    if (_.isString(action.value) && action.value.indexOf("$(") !== -1) return true;
    else if (_.isString(action.selector) && action.selector.indexOf("$(") !== -1) return true;
    else if (_.isString(action.url) && action.url.indexOf("$(") !== -1) return true;
    else if (_.isString(action.cookieDomain) && action.cookieDomain.indexOf("$(") !== -1) return true;

    var containsEvals = false;

    if (action.type === "COMPONENT" || action.type === "REQUEST") {
      action.variables.forEach((variable) => {
        if (_.isString(variable.value) && variable.value.indexOf("$(") !== -1) containsEvals = true;
      });
      if (containsEvals) return true;
    }

    if (action.type === "CSV_INSERT") {
      if (action.csvName.indexOf("$(") !== -1) return true;

      action.columns.forEach((column) => {
        if (column.columnName.indexOf("$(") !== -1) containsEvals = true;
        if (column.selector.indexOf("$(") !== -1) containsEvals = true;
        if (column.select.indexOf("$(") !== -1) containsEvals = true;
      })
    }

    return containsEvals;

  }

  function applyEvals(action, variables) {
    return new Promise((resolve, reject) =>{

      if (!_hasEvalVars(action)) return resolve(action);

      var code =
        `if (typeof window.evalActionValues !== "undefined") window.evalActionValues(${JSON.stringify(action)}, ${JSON.stringify(variables)}, ${JSON.stringify(dynamicVars)})`;
      chrome.tabs.executeScript(_getCurrentTabId(), {code}, (result, error) => {
        if (!error && !result) return resolve(action);
        if (error) return reject(error);
        if (!result || !result[0]) return resolve(action);
        if (result[0] && result[0].error) return reject({message: result[0].error});
        Object.assign(dynamicVars, result[0].dynamicVars);
        return resolve(result[0].action);
      });
    })
  }

  function _applyVarToAction(action, key, value) {

    var myRegEx = new RegExp(`\\$\\{${key}\\}`, "g");

    if (_.isString(action.value)) action.value = action.value.replace(myRegEx, value);
    if (_.isString(action.selector)) action.selector = action.selector.replace(myRegEx, value);
    if (_.isString(action.cookieDomain)) action.cookieDomain = action.cookieDomain.replace(myRegEx, value);

    if (action.type === "REQUEST" && action.request) {
      if (_.isString(action.request.url)) action.request.url = action.request.url.replace(myRegEx, value);
      if (_.isString(action.request.body)) action.request.body = action.request.body.replace(myRegEx, value);
    }

    if (action.type === "COMPONENT") {
      action.variables.forEach((variable) => {
        if (_.isString(variable.value)) variable.value = variable.value.replace(myRegEx, value);
      })
    }
    if (action.type === "CSV_INSERT") {
      action.csvName = action.csvName.replace(myRegEx, value);
      action.columns.forEach((column) => {
        column.columnName = column.columnName.replace(myRegEx, value);
        column.selector = column.selector.replace(myRegEx, value);
      })
    }
  }

  function findNextInScope(scope, thisActionIdx, lookForType) {

    // coerce "thisActionIdx" into the index (in case someone passes in an action)
    if (typeof thisActionIdx !== "string") thisActionIdx = findIndexById(scope, thisActionIdx.id);

    var searchCursor = thisActionIdx + 1;
    var results = [];

    while (searchCursor < scope.length) {
      if (scope[searchCursor].type === lookForType) results.push(scope[searchCursor])
      searchCursor++;
    }

    return results;

  }

  function findOneNextInScope(scope, thisActionIdx, lookForType) {
    return findNextInScope(scope, thisActionIdx, lookForType)[0];
  }

  function getFirstActionOfNextScope(actionPool, action) {

    // at this point, we find the new root action of the next scope (if any)
    var idxOfAction = findIndexById(actionPool, action.id);
    var nextAction = actionPool[idxOfAction + 1];

    if (nextAction && nextAction.indent > action.indent) {
      return nextAction;
    }

  }

  function buildSubroutine(initialAction, testContext, caller, compVars) {

    testContext = deepClone(testContext);

    // build an array of all actions on this current indent level, excluding actions at a higher indent level
    var indent = initialAction.indent ? initialAction.indent : 0;
    var currentAction = initialAction;
    var scopeActions = [];

    while ((!currentAction.indent ? 0 : currentAction.indent) >= indent) {

      if (!currentAction.indent) currentAction.indent = 0;

      if (currentAction.indent === indent) {
        scopeActions.push(currentAction);
      }
      var currentActionIdx = findIndexById(testContext, currentAction.id);

      if (testContext[currentActionIdx + 1])
        currentAction = testContext[currentActionIdx + 1];
      else
        break;
    }

    return {
      actions: deepClone(scopeActions),
      testContext,
      caller,
      compVars,
      actionCursor: 0,
      propogateError: true
    };

  }

  function performAction(action, subroutine, derivedVariables) { return new Promise((resolve, reject) => {

    var actionDef;
    if (action.type === "ELSE") actionDef = actionDefs["ELSEIF"];
    else actionDef = actionDefs[action.type];

    if (actionDef) return actionDef.perform(_getCurrentTabId(), frameStack, action, state, subroutine, {derivedVariables, dynamicVars, dataVars }).then((result) => resolve(result));
    else resolve({error: null, skipped: true});

  })}

  const waitPlaybackInterval = (state) => new Promise((resolve, reject) => {
    if (state.playbackInterval) setTimeout(() => resolve(), state.playbackInterval);
    else resolve();
  });

  function _rehydrateSubroutines() {

    // at this point, we need to update the existing subroutines with new changes on the test.
    stack.forEach((subroutine) => {
      subroutine.actions.forEach((action) => {
        var hydrateWithAction = _.find(state.activeTest.actions, {id: action.id});
        Object.assign(action, hydrateWithAction);
      })
    });

  }

  function _prepResult(action, subroutine) {
    if (action.type !== "COMPONENT"
      && action.type !== "TRY"
      && action.type !== "CATCH"
      && action.type !== "BREAK"
      && action.type !== "IF"
      && action.type !== "ELSEIF"
      && action.type !== "ELSE"
      && action.type !== "WHILE"
      && action.type !== "DOWHILE"
    ) {
      state.playbackResult[(subroutine.caller && subroutine.caller.type === "COMPONENT")? subroutine.caller.id + "COMPONENT" + action.id : action.id] = {
        processing: true
      };
    }
  }

  function _reportResult(action, result, elapsedTime, subroutine) {

    var actionResult = {
      actionId: action.id,
      actionType: action.type,
      actionDef: getActionDefinition(action.type, action.value, action.selector, action.selectorType),
      duration: elapsedTime,
    };

    if (_.isString(action.screenshot) && action.screenshot.length > 0) {
      actionResult.ss_url = `/api/snaptest/1/${state.contextType}/${state.contextId}/s/${action.screenshot}`;
      actionResult.ss_uuid = action.screenshot;
    }

    if (_.isString(action.description) && action.description.length > 0) actionResult.description = action.description;
    if (_.isString(action.value) && action.value.length > 0) actionResult.value = action.value;
    if (_.isString(action.selector) && action.selector.length > 0 ) actionResult.selector = action.selector;
    if (_.isString(action.selectorType) && action.selectorType.length > 0) actionResult.selectorType = action.selectorType;
    if (_.isString(result.error) && result.error.length > 0) actionResult.error = result.error;
    if (result.skipped) actionResult.skipped = result.skipped;

    state.playbackResult[(subroutine.caller && subroutine.caller.type === "COMPONENT") ? subroutine.caller.id + "COMPONENT" + action.id : action.id] = {
      processing: false,
      skipped: result.skipped,
      success: !result.error,
      message: result.error ? result.error : null
    };

    // Get out if this action was marked not to be reported.
    if (ActionsByConstant[action.type] && !ActionsByConstant[action.type].reportResult) return;

    try {
      // Mark something a success if it's part of a condition.
      if (
        subroutine.caller && (subroutine.caller.type === "IF" || subroutine.caller.type === "ELSEIF" || subroutine.caller.type === "WHILE" || subroutine.caller.type === "DOWHILE")
        && subroutine.caller.value && subroutine.caller.value.id === action.id
      ) {
        if (actionResult && actionResult.error) {
          actionResult.condition = actionResult.error;
          actionResult.conditionT = subroutine.caller.type;
          delete actionResult.error;
        } else if (actionResult.actionId === subroutine.caller.value.id) {
          actionResult.condition = "True";
          actionResult.conditionT = subroutine.caller.type;
        }
      }
    } catch (e) {
      // wrap in try/catch so we don't bust peoples tests.  This isn't vital code.
    }

    testResult.results.push(actionResult);

  }

  function _onComplete() {

    loopIndex++;

    if (state.playbackLoopAmount && loopIndex < state.playbackLoopAmount) {
      events.onLoopComplete(testResult);
      return begin();
    } else {

      testResult.totalActions = countReportableActions(state.activeTest, state);

      testResult.totalPassing = testResult.results.filter((result) =>
        result.condition || (result.actionType && ActionsByConstant[result.actionType] && ActionsByConstant[result.actionType].reportResult && !result.error)
      ).length;

      testResult.totalFailing = testResult.results.filter((result) =>
        !result.condition && result.actionType && ActionsByConstant[result.actionType] && ActionsByConstant[result.actionType].reportResult && result.error
      ).length;

      testResult.duration = testResult.results.map((result) => result.duration).reduce((total, duration) => total + duration, 0);

      var hasConditionActions = state.activeTest.actions.filter((action) => ["IF", "ELSEIF", "WHILE", "DOWHILE", "CATCH"].indexOf(action.type) !== -1).length > 0;

      // Fill in skipped action results if it's a simple test (without conditions & flow control)
      if (testResult.results.length && !hasConditionActions)  {
        var lastReport = testResult.results[testResult.results.length - 1].actionId;
        var idxOfNextReport = _.findIndex(state.activeTest.actions, {id: lastReport});
        state.activeTest.actions.filter((action, idx) => idx > idxOfNextReport).forEach((action) => {
          if (ActionsByConstant[action.type] && !ActionsByConstant[action.type].reportResult) return;
          testResult.results.push({
            actionId: action.id,
            actionType: action.type,
            actionDef: getActionDefinition(action.type, action.value, action.selector, action.selectorType),
            duration: 0,
            skipped: true
          })
        });
      }

      if (testResult.error) {
        state.isPlayingBack = false;
        state.playbackCursor = null;

        var uuid = uuidv4();
        var partialSSUri;
        testResult.error_ss = `/api/snaptest/1/${state.contextType}/${state.contextId}/s/${uuid}`;
        testResult.error_ss_uuid = uuid;


        partialScreenshot(state.currentWindowId).then((ssUri) => {
          partialSSUri = ssUri;
          return fullScreenshot(state.currentWindowId, state.currentTabId);
        }).then((fullSSUri) => {
          saveScreenshot(fullSSUri.length < 10000000 ? fullSSUri : partialSSUri, uuid).then(() => {
            events.onComplete(testResult, {csvs: dataVars});
          });
        }).catch((e) => {
          events.onComplete(testResult, {csvs: dataVars});
        });

      } else {
        resetModes(state);
        events.onComplete(testResult, {csvs: dataVars});
      }

    }
  }

  function begin() {
    return new Promise((resolve, reject) => {

      _reset();

      state.isPlayingBack = true;
      var actionsToRun = [];

      if (state.activeTest.type === "request") {
        var requestAction = new RequestAction(state.activeTest.id);
        requestAction.reportResult = true;
        actionsToRun.push(requestAction);
      } else {
        state.activeTest.actions.forEach((action) => { delete action.result; });
        actionsToRun = state.activeTest.actions;
      }

      var testActions = deepClone(actionsToRun);
      if (testActions.length === 0) {
        // empty test case
        _onComplete();
        return resolve([]);
      }

      var rootSubroutine = buildSubroutine(testActions[0], testActions, null);
      stack.push(rootSubroutine);

      callStackHead();

    })
  }

  function pause() {
    if (status !== "RUNNING") return;
    state.isPlayingBack = false;
    status = "PAUSING";
  }

  function resume() {

    if (stackErrorSnapshot) {
      status = "RUNNING";
      state.isPlayingBack = true;
      stack = stackErrorSnapshot;
      _rehydrateSubroutines();
      callStackHead(null, true);
      return;
    }

    if (status !== "PAUSED") return;

    status = "RUNNING";
    state.isPlayingBack = true;


    if (stack.length > 0) {
      _rehydrateSubroutines();
      callStackHead(null, true);
    }
  }

  function destroy() {
    resetModesAndPlayback(state);
    status = "TERMINATED";
    events.onDestroy();
  }

  function step() {
    if (status !== "PAUSED") return;
    status = "STEPPING";
    if (stack[0]) callStackHead();
  }

  return {
    begin,
    pause,
    resume,
    step,
    destroy
  }
}

function findIndexById(array, identifier) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].id === identifier) return i;
  }
  return null;
}
