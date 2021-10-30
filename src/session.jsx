import {
  addAction,
  addRecordedAction,
  duplicateAction,
  getLaterTestState,
  getPriorTestState,
  moveAction,
  removeAction,
  removeActions,
  shiftDownAction,
  shiftUpAction,
  testSnapshot,
  updateAction
} from './util/ActionManager';
import Message from './util/Message'
import * as Actions from './models/Action'
import {ComponentAction} from './models/Action'
import {StringVariable} from './models/Variable'
import RouteModel from './models/Route';
import Route from './models/Route';
import Component from './models/Component';
import DataProfile from './models/DataProfile';
import _ from 'lodash';
import {generate as generateId} from 'shortid'
import {autoSave, removeItemFromDB, repairDirectory} from './util/statePersistance'
import {findNode, findNodeById, getParent, removeNodeFromTree, walkThroughTreeNodes} from './util/treeUtils';
import deepClone from 'deep-clone'
import * as Tut from './models/tutconsts';
import * as LocalActions from './actions/LocalActions';
import * as TestActions from './actions/TestActions';
import * as UserActions from './actions/UserActions';
import {processAction} from './actions';
import {setUserSetting} from './actions/SettingsActions'
import {buildTagMap} from './actions/TagActions'
import {onPageChange} from './util/ModeManager'
import {getDefaultTree, getInitialMultiplaybackResults, getInitialState} from "./initialState";
import {switchDraftContexts} from "./managers/DraftManager";

var URL = require('url-parse');

const generators = {
  "nightwatch": {
    "flat": require('./generators/nightwatch/flat'),
  },
  "chromeless": {
    "flat": require('./generators/chromeless/flat'),
    "prototype": require('./generators/chromeless/prototype')
  }
};

var state = getInitialState();

chrome.storage.sync.get(['user'], function(data) {
  if (data.user) {
    state.user = data.user;
    UserActions.switchToCloud({skipLocalCaching: true}, state);
  } else {
    chrome.storage.local.get(['localModeCache'], (data) => {
      if (data.localModeCache) {
        var localModeCache = data.localModeCache;
        state.components = localModeCache.components || [];
        state.drafts = localModeCache.drafts || [];
        state.directory = localModeCache.directory || {tree: getDefaultTree("tests")};
        state.tests = localModeCache.tests || [];
        state.runs = localModeCache.runs || [];
        state.tags = localModeCache.tags || [];
        state.testsInTagsMap = localModeCache.testsInTagsMap || {};
        state.dataProfiles = localModeCache.dataProfiles || [];
      }
    });
  }
});

// Dispatcher
Message.onMessageFor(Message.SESSION, function(message, sender, sendResponse) {

  // PROMISE IPC PATTERN
  if (message.payload && message.payload.type === "PROMISEACTION") return processAction(message, state, sendResponse);

  shouldGenDraft(state, message);

  var test = state.activeTest;
  var tempResponse = {};
  var excludeTestsInResponse = shouldOptimizeResponse(message.action);

  switch(message.action) {
    case "updateUserData":
      UserActions.getUser({}, state).then(() => Message.toAll("stateChange", state));
      break;
    case "setModal":

      if (!message.payload) {
        state.modal = null;
        state.modalMeta = {};
      }
      else if (_.isString(message.payload)) {
        state.modal = message.payload;
        state.modalMeta = {};
      } else {
        state.modal = message.payload.name;
        state.modalMeta = message.payload.meta;
      }

      break;
    case "openWindow":
      if (!state.appWindowId) {

        var url = "window.html";

        chrome.windows.create({url, type: "popup", width: state.appWindowWidth, left: state.appWindowX, focused: true}, (window) => {
          state.appWindowId = window.id;
          Message.toAll("stateChange", state);
        });
      } else {
        chrome.windows.update(state.appWindowId, {focused: true});
      }
      break;
    case "setHasFamiliarized":
      state.hasFamiliarized = message.payload;
      break;
    case "setSplashActivated":
      state.splashActivated = message.payload;
      break;
    case "generateExamples":
      TestActions.generateExamples({}, state);
      break;

    case "openVarTooltip":
      state.varTooltipOpen = true;
      state.varTooltipX = message.payload.x;
      state.varTooltipY = message.payload.y;
      state.varTooltipTarget = message.payload.target;
      state.varTooltipCompContext = message.payload.componentActionId;
      excludeTestsInResponse = true;
      break;

    case "closeVarTooltip":
      excludeTestsInResponse = true;
      state.varTooltipOpen = false;
      break;

    case "setTutStep":
      if (_.isNumber(message.payload)) {
        state.tutorialStep = Tut.getStepName(message.payload);
        state.tutorialStepNumber = message.payload;
      } else {
        state.tutorialStep = message.payload;
        state.tutorialStepNumber = Tut.getStepIndex(message.payload)
      }
      break;
    case "setSaveWarningActivated":
      state.saveWarningActivated = message.payload;
      break;
    case "setTutActive":
      state.tutorialActivated = message.payload;
      break;
    case "setLiveOutput":
      state.liveoutput = message.payload;
      break;
    case "setWindowDimensions":
      state.appWindowWidth = message.payload.width;
      break;
    case "logout":

      state.localmode = true;
      state.viewStack = [new RouteModel("dashboard")];
      state.viewingProfile = null;
      state.autoSaveStatus = "off";
      state.syncing = false;
      state.projects = [];
      state.orgs = [];
      state.selectedOrg = null;
      state.collaborators = [];
      state.selectedProject = null;
      state.contextType = "user";
      state.contextId = "me";

      var localModeCache = LocalActions.getLocaCache();
      state.components = localModeCache.components || [];
      state.drafts = localModeCache.drafts || [];
      state.directory = localModeCache.directory || {tree: getDefaultTree("tests")};
      state.tests = localModeCache.tests || [];
      state.runs = localModeCache.runs || [];
      state.tags = localModeCache.tags || [];
      state.testsInTagsMap = localModeCache.testsInTagsMap || {};
      state.dataProfiles = localModeCache.dataProfiles || [];

      state.user = null;
      chrome.storage.sync.clear();

      break;
    case "setUser":
      state = setUser(message.payload, state);
      break;
    case "setPlaybackInterval":
      state.playbackInterval = message.payload;
      break;
    case "setPlaybackLoopAmount":
      state.playbackLoopAmount = message.payload;
      break;
    case "setHoverIndicator":
      excludeTestsInResponse = true;
      state.actionElIndicatorSelector = message.payload;
      break;
    case "setIncludeHarness":
      state.includeHarness = message.payload;
      break;
    case "setFramework":
      state.selectedFramework = message.payload.framework;
      state.selectedStyle = message.payload.style;
      if (state.activeTest) {
        state.generatedCode = generators[state.selectedFramework][state.selectedStyle].generate(state.activeTest, state.components);
      }
      break;
    case "setTopDirName":
      state.topDirName = message.payload;
      break;
    case "setLocalMode":

      if (state.localmode) break; // get out if already in local mode.

      switchDraftContexts("local", null, state);

      state.localmode = true;
      state.viewStack = [new RouteModel("dashboard")];
      state.viewingProfile = null;
      state.autoSaveStatus = "off";
      state.syncing = false;
      state.projects = [];
      state.selectedOrg = null;
      state.collaborators = [];
      state.selectedProject = null;
      state.projectReadAccessDenied = false;
      state.tagTestFilters = [];
      state.testFilterOperator = "AND";

      var localModeCache = LocalActions.getLocaCache();
      state.components = localModeCache.components || [];
      state.drafts = localModeCache.drafts || [];
      state.directory = localModeCache.directory || {tree: getDefaultTree("tests")};
      state.tests = localModeCache.tests || [];
      state.runs = localModeCache.runs || [];
      state.tags = localModeCache.tags || [];
      state.testsInTagsMap = localModeCache.testsInTagsMap || {};
      state.dataProfiles = localModeCache.dataProfiles || [];
      state.tagIdtoNameMap = buildTagMap(localModeCache.tags);

      break;

    case "setUserSetting":
      state.userSettings[message.payload.setting] = message.payload.value;
      autoSave({type: "userSettings", ...state.userSettings, selectorPriority: JSON.stringify(state.userSettings.selectorPriority)}, state, true);
      break;

    case "setSyncing":
      state.syncing = message.payload;
      break;

    case "changeDataProfileName":
      var thisDataProfile = _.find(state.dataProfiles, {id: message.payload.profileId});

      if (thisDataProfile) {
        thisDataProfile.name = message.payload.newName;
        autoSave({...thisDataProfile, type: "dataProfile"}, state, true);
      }
      break;

    case "changeDataProfileHidden":

      var thisDataProfile = _.find(state.dataProfiles, {id: message.payload.profileId});

      if (thisDataProfile) {
        thisDataProfile.hidden = message.payload.hidden;
        autoSave({...thisDataProfile, type: "dataProfile"}, state, true);
      }
      break;

    case "copyAllToPrivate":

      var localModeCache = LocalActions.getLocaCache();

      localModeCache["tests"] = deepClone(state.tests);
      localModeCache["runs"] = deepClone(state.runs);
      localModeCache["tags"] = deepClone(state.tags);
      localModeCache["testsInTagsMap"] = deepClone(state.testsInTagsMap);
      localModeCache["components"] = deepClone(state.components);
      localModeCache["dataProfiles"] = deepClone(state.dataProfiles);
      localModeCache["directory"] = deepClone(state.directory);

      LocalActions.saveEditedCache(localModeCache);

      break;

    case "copyTestTo":

      var test = _.find(state.tests, {id: message.payload.testId});
      var collectionActedOn = "tests";

      if (!test) {
        test = _.find(state.components, {id: message.payload.testId});
        if (test) {
          collectionActedOn = "components";
        } else return;
      }

      var copiedTest = deepClone(test);
      copiedTest.id = generateId();

      if (message.payload.destination === "local") {
        var localModeCache = LocalActions.getLocaCache();
        localModeCache[collectionActedOn].push(copiedTest);
        LocalActions.saveEditedCache(localModeCache);
      } else {
        autoSave(copiedTest, state, true);
      }
      break;

    case "toggleFolder":
      var idxOfPayload = state.openFolders.indexOf(message.payload);

      if (idxOfPayload === -1) {
        state.openFolders.push(message.payload);
      } else {
        state.openFolders.splice(idxOfPayload, 1);
      }

      if (!state.sudoer) setUserSetting({key: "openFolders", value: state.openFolders}, state);

      break;

    case "expandAllFolders":

      state.openFolders = [];

      walkThroughTreeNodes(state.directory.tree, (node) => {
        if (node.module) state.openFolders.push(node.id);
      });

      if (!state.sudoer) setUserSetting({key: "openFolders", value: state.openFolders}, state);
      break;

    case "collapseAllFolders":
      state.openFolders = [];
      if (!state.sudoer) setUserSetting({key: "openFolders", value: state.openFolders}, state);
      break;

    case "removeFolder":

      removeNodeFromTree(state.directory.tree, message.payload);
      autoSave({type: "directory", directory : state.directory}, state, state.localmode ? false : true);

      break;

    case "repairDirectory":
      repairDirectory(state);
      break;

    case "directoryMove":
      // directory move (within accounts directory tree).

      var {dest, source, location} = message.payload;
      var destNode = findNode(state.directory.tree, {id: dest});
      var sourceNode = deepClone(findNode(state.directory.tree, {id: source}));

      // can't move something onto itself...
      if (destNode.id === sourceNode.id) break;

      // dropping a folder into a subfolder isn't allowed...
      if (sourceNode.children || !sourceNode.testId) {
        var isInSubdirectory = false;
        walkThroughTreeNodes(sourceNode, (node) => {
          if (destNode.id === node.id) isInSubdirectory = true;
        });
        if (isInSubdirectory) break;
      }

      // valid dropping into a folder case...
      if (destNode.children || !destNode.testId) {

        removeNodeFromTree(state.directory.tree, sourceNode.id);

        if (!destNode.children) destNode.children = []; // repair folder nodes with no children array :(

        if (location === "above") {
          var parentOfDestNode = getParent(state.directory.tree, destNode);
          parentOfDestNode = findNodeById(state.directory.tree, parentOfDestNode.id);
          var indexOfDestNode = _.findIndex(parentOfDestNode.children, {id: destNode.id });
          parentOfDestNode.children.splice(indexOfDestNode, 0, sourceNode)
        }
        else if (location === "below") {
          var parentOfDestNode = getParent(state.directory.tree, destNode);
          parentOfDestNode = findNodeById(state.directory.tree, parentOfDestNode.id);
          var indexOfDestNode = _.findIndex(parentOfDestNode.children, {id: destNode.id });
          parentOfDestNode.children.splice(indexOfDestNode + 1, 0, sourceNode)
        }
        else {
          destNode.children.unshift(sourceNode)
          if (state.openFolders.indexOf(destNode.id) === -1) { // auto open folder when something is added.
            state.openFolders.push(destNode.id);
          }
        }

      }

      // valid dropping next to a test case...
      else {

        removeNodeFromTree(state.directory.tree, sourceNode.id);

        walkThroughTreeNodes(state.directory.tree, (node, parent) => {

          if (node.id === destNode.id) {

            var idxOfChild = _.findIndex(parent.children, {id: node.id});

            if (idxOfChild !== -1) {
              if (location === "above") {
                parent.children.splice(idxOfChild, 0, sourceNode)
              } else {
                parent.children.splice(idxOfChild + 1, 0, sourceNode);
              }
              return false;
            }

          }
        })
      }

      autoSave({type: "directory", directory : state.directory}, state, state.localmode ? false : true);

      break;

    case "moveTestTo":

      var test = _.find(state.tests, {id: message.payload.testId});
      var collectionActedOn = "tests";

      if (!test) {
        test = _.find(state.components, {id: message.payload.testId});
        if (test) {
          collectionActedOn = "components";
        } else return;
      }

      var copiedTest = deepClone(test);
      copiedTest.id = generateId();

      if (message.payload.destination === "local") {
        var localModeCache = LocalActions.getLocaCache();
        localModeCache[collectionActedOn].push(copiedTest);
        LocalActions.saveEditedCache(localModeCache);
      } else {
        autoSave(copiedTest, state, true);
      }

      removeItemFromDB(test, state);
      state[collectionActedOn].splice(_.findIndex(state[collectionActedOn], {id: test.id}), 1);

      var nodeToDelete = findNode(state.directory.tree, {testId: test.id});
      state.directory.tree = removeNodeFromTree(state.directory.tree, nodeToDelete.id);

      break;

    case "shouldRefresh":
      state.shouldRefresh = message.payload;
      break;
    case "addDataProfile":

      var newVariables = message.payload.variables.map((variable) => new StringVariable(variable.name, variable.defaultValue));
      var newDataProfile = new DataProfile(message.payload.name, newVariables);
      newDataProfile.profileId = newDataProfile.id;

      state.dataProfiles.push(newDataProfile);

      autoSave({...newDataProfile, type: "dataProfile"}, state, true);

      break;
    case "viewDataProfile":
      state.viewingProfile = message.payload;
      break;

    case "removeDataProfile":
      var thisDataProfileIdx = _.findIndex(state.dataProfiles, {id: message.payload});

      if (thisDataProfileIdx !== -1) {
        var removedDataProfile = state.dataProfiles.splice(thisDataProfileIdx, 1);
        state.viewingProfile = null;
        removeItemFromDB({...removedDataProfile[0], type: "dataProfile"}, state);
      }

      break;

    case "toggleProfile":

      var idxOfPayload = state.closedProfiles.indexOf(message.payload);

      if (idxOfPayload === -1) {
        state.closedProfiles.push(message.payload);
      } else {
        state.closedProfiles.splice(idxOfPayload, 1);
      }

      if (!state.sudoer) setUserSetting({key: "closedProfiles", value: state.closedProfiles}, state);

      break;

    case "collapseAllProfiles":

      state.closedProfiles = [];

      state.dataProfiles.forEach((profile) => state.closedProfiles.push(profile.id));

      if (!state.sudoer) setUserSetting({key: "closedProfiles", value: state.closedProfiles}, state);

      break;

    case "expandAllProfiles":

      state.closedProfiles = [];

      if (!state.sudoer) setUserSetting({key: "closedProfiles", value: state.closedProfiles}, state);

      break;

    case "setSelectedDataProfile":

      var idxOfProfile = _.findIndex(state.dataProfiles, {id: message.payload});

      if (message.payload === "none" || idxOfProfile === -1) {
        state.selectedProfile = null;
      } else {
        state.selectedProfile = message.payload;
      }
      break;

    case "setViewTestDescription":
      state.viewTestDescription = message.payload;
      break;

    case "setViewTestVars":
      state.viewTestVars = message.payload;
      break;

    case "addRun":
      message.payload.id = generateId();
      state.runs.push(message.payload);
      autoSave({...message.payload, type: "run"}, state);
      break;

    case "editRun":

      var runIdx = _.findIndex(state.runs, {id: message.payload.id});

      autoSave({...state.runs[runIdx], type: "run"}, state);

      if (runIdx !== -1) {
       state.runs.splice(runIdx, 1, message.payload);
      }

      break;

    case "deleteRun":
      var runIdx = _.findIndex(state.runs, {id: message.payload});

      removeItemFromDB({...state.runs[runIdx], type: "run"}, state);

      if (runIdx !== -1) {
        state.runs.splice(runIdx, 1);
      }

      break;

    case "setEditingRun":
      state.editingRun = message.payload;
      break;

    case "addTestFolder":

      var folderId = generateId();
      state.directory.tree.children.unshift({ "collapsed": false, "module": "New folder", id: folderId, children: [] });
      state.openFolders.push(folderId);

      autoSave({type: "directory", directory : state.directory}, state, state.localmode ? false : true);

      break;
    case "saveTree":

      state.directory.tree = message.payload;
      autoSave({type: "directory", directory : state.directory}, state, state.localmode ? false : true);

      break;
    case "saveDraft":
      var draftToSaveIdx = _.findIndex(state.drafts, {id: message.payload});
      if (draftToSaveIdx !== -1) {

        var draftToSave = state.drafts[draftToSaveIdx];
        var saveToCollection = draftToSave.type === "component" ? "components" : "tests";
        draftToSave.draft = false;

        // update case
        if (draftToSave.draftOf) {
          var itemToUpdateIdx = _.findIndex(state[saveToCollection], {id: draftToSave.draftOf});
          draftToSave.id = draftToSave.draftOf;
          delete draftToSave.draftOf;
          delete draftToSave.draft;
          state[saveToCollection].splice(itemToUpdateIdx, 1, deepClone(draftToSave))
        }
        // new case
        else {
          delete draftToSave.draftOf;
          delete draftToSave.draft;
          state[saveToCollection].push(deepClone(draftToSave))
          state.directory.tree.children.unshift({type: saveToCollection === "tests" ? "test" : "component", id: generateId(), testId: draftToSave.id});
        }

        if (!state.localmode) {
          autoSave({type: "directory", directory: state.directory}, state, true);
          autoSave(draftToSave, state, true);  // force a save
        }

        state.drafts.splice(draftToSaveIdx, 1);

      }
      break;
    case "changeTestFolderName":
      var node = findNodeById(state.directory.tree, message.payload.id);
      node.module = message.payload.name;
      autoSave({type: "directory", directory: state.directory}, state, state.localmode ? false : true);

      break;

    case "dismissAllWarningsSelected":
      testSnapshot(state, state.activeTest);
      test.actions.filter((action) => action.warnings.length > 0 && state.selectedRows.indexOf(action.id)).forEach((action) => {
        action.warnings = [];
      });
      autoSave(test, state);
      break;

    case "breakpointsToWarningsSelected":
      state.playbackBreakpoints = [];
      test.actions.filter((action) => action.warnings.length > 0 && state.selectedRows.indexOf(action.id)).forEach((action) => {
        state.playbackBreakpoints.push(action.id);
      });
      break;
    case "explodeComponent":

      testSnapshot(state, state.activeTest);

      var actionWithComponent = _.findIndex(state.activeTest.actions, {id: message.payload.actionId});
      var component = _.find(state.components, {id: message.payload.componentId});

      if (actionWithComponent !== -1) {
        var newActions = component.actions.slice(0);
        newActions.forEach((action) => {action.id = generateId()});
        state.activeTest.actions.splice(actionWithComponent, 1, ...newActions);
      }

      autoSave(test, state);

      break;
    case "clearBreakpoints":
      state.playbackBreakpoints = [];
      break;
    case "startSelection":
      state.isRecording = false;
      state.isAssertMode = false;
      state.isSelecting = true;
      state.selectingForActionId = message.payload.action.id;
      state.selectingForParentActionId = message.payload.parentAction ? message.payload.parentAction.id : null;
      state.selectingForAction = message.payload.action;
      state.selectionCandidate = null;
      break;
    case "cancelSelection":
      state.isSelecting = false;
      state.selectingForActionId = null;
      state.selectingForParentActionId = null;
      state.selectingForAction = null;
      state.selectionCandidate = null;
      break;
    case "setSelectionCandidate":
      state.selectionCandidate = message.payload;
      break;
    case "setSelection":

      var actionToSave = _.find(state.activeTest.actions, {id: state.selectingForParentActionId || state.selectingForActionId});
      var actionToUpdate = state.selectingForParentActionId ? actionToSave.value : actionToSave;

      actionToUpdate.warnings = []; // clear selector warnings (will need updated when there are new types of warnings)
      actionToUpdate.selector = message.payload;
      state.isSelecting = false;
      state.selectingForActionId = null;
      state.selectingForParentActionId = null;
      state.selectingForAction = null;
      state.selectionCandidate = null;
      updateAction(state, test, actionToSave);
      autoSave(test, state);
      break;
    case "setShowHotkeys":
      state.showHotkeys = message.payload;
      break;
    case "addNewTest":
      if (state.userSettings.drafts) {
        message.payload.draft = true;
        state.drafts.push(message.payload);
      } else {
        state.tests.push(message.payload);
        state.directory.tree.children.unshift({"module": message.payload.name, testId: message.payload.id, leaf: true, id: generateId(), type: "test"});
        autoSave(message.payload, state);
      }
      break;
    case "addNewComponent":
      if (state.userSettings.drafts) {
        message.payload.draft = true;
        state.drafts.push(message.payload);
      } else {
        state.components.push(message.payload);
        state.directory.tree.children.unshift({"module": message.payload.name, testId: message.payload.id, leaf: true, id: generateId(), type: "component"});
        autoSave(message.payload, state);
      }
      break;
    case "duplicateTest":

      var collectionToUpdate = message.payload.type === "component" ? "components" : "tests";

      if (state.userSettings.drafts) {

        var testToDup = _.find(state.drafts, {id: message.payload.id});
        if (!testToDup) testToDup = _.find(state[collectionToUpdate], {id: message.payload.id});

        if (testToDup) {
          var dupTest = {...testToDup, actions: testToDup.actions.slice(0), variables: testToDup.variables.slice(0) };
          dupTest.id = generateId();
          dupTest.draft = true;
          dupTest.name = "Copy of " + dupTest.name;
          state.drafts.push(dupTest);
        }

      } else {

        var testToDup = _.find(state[collectionToUpdate], {id: message.payload.id});
        var dupTest = deepClone(testToDup);

        dupTest.id = generateId();
        dupTest.name = "Copy of " + dupTest.name;
        state[collectionToUpdate].push(dupTest);

        var node = findNode(state.directory.tree, {testId: testToDup.id});
        var parent = getParent(state.directory.tree, node);
        var parentNode = findNodeById(state.directory.tree, parent.id);
        var indexOfDuppedNode = _.findIndex(parentNode.children, {id: node.id});
        parentNode.children.splice(indexOfDuppedNode, 0, {id: generateId(), testId: dupTest.id, type: message.payload.type});

        repairDirectory(state);
        autoSave(dupTest, state);
        autoSave({type: "directory", directory : state.directory}, state);

      }

      break;
    case "deleteTest":

      var draftToDelete = _.findIndex(state.drafts, {id: message.payload});

      if (draftToDelete > -1) {
        state.drafts.splice(draftToDelete, 1);
      } else {
        var testToDelete = _.findIndex(state.tests, {id: message.payload});
        if (state.activeTest && state.tests[testToDelete].id === state.activeTest.id) {
          state.activeTest = null;
          state.viewStack = [new Route("dashboard")];
        }

        var nodeToDelete = findNode(state.directory.tree, {testId: message.payload});
        var folderNodeParent = getParent(state.directory.tree, nodeToDelete);

        removeItemFromDB(state.tests[testToDelete], state, folderNodeParent.id );

        state.directory.tree = removeNodeFromTree(state.directory.tree, nodeToDelete.id);
        state.tests.splice(testToDelete, 1);
        if (state.testsInTagsMap[message.payload]) delete state.testsInTagsMap[message.payload]
      }

      break;
    case "deleteComponent":

      var draftToDelete = _.findIndex(state.drafts, {id: message.payload});

      if (draftToDelete > -1) {
        state.drafts.splice(draftToDelete, 1);
      } else {
        var compToDelete = _.findIndex(state.components, {id: message.payload});
        if (state.activeTest && state.components[compToDelete].id === state.activeTest.id) {
          state.activeTest = null;
          state.viewStack = [new Route("dashboard")];
        }
        removeItemFromDB(state.components[compToDelete], state );
        var nodeToDelete = findNode(state.directory.tree, {testId: message.payload});
        state.directory.tree = removeNodeFromTree(state.directory.tree, nodeToDelete.id);
        state.components.splice(compToDelete, 1);
      }
      break;

    case "addVar":
      state.activeTest.variables.push(message.payload);
      autoSave(test, state);
      break;
    case "updateVar":
      var varToUpdate = _.findIndex(state.activeTest.variables, {id: message.payload.id});
      state.activeTest.variables.splice(varToUpdate, 1, message.payload);
      autoSave(test, state);
      break;
    case "deleteVar":
      var varToDelete = _.findIndex(state.activeTest.variables, {id: message.payload.id});
      state.activeTest.variables.splice(varToDelete, 1);
      autoSave(test, state);
      break;
    case "setTestActive":
      state.activeTest = _.find(state.tests, {id: message.payload});
      if (!state.activeTest) state.activeTest = _.find(state.drafts, {id: message.payload});
      if (state.multiPlaybackResults[state.activeTest.id]) {
        state.playbackResult = state.multiPlaybackResults[state.activeTest.id].playbackResult;
      }
      state.activeFolder = null;
      break;
    case "setFolderActive":
      state.activeTest = null;
      state.activeFolder = message.payload;
      break;
    case "setTests":
      state.tests = message.payload;
      break;
    case "setComponents":
      setComponents(message.payload, state);
      break;
    case "setComponentActive":
      state.activeTest = _.find(state.components, {id: message.payload});
      if (!state.activeTest) state.activeTest = _.find(state.drafts, {id: message.payload});
      state.activeFolder = null;
      break;

    case "newRouteStack":
      state.viewStack = [new Route("dashboard"), message.payload];
      break;

    case "pushRoute":

      onPageChange(state);

      state.viewStack.push(message.payload);

      if (message.payload.name === "dashboard") {
        if (!state.localmode) TestActions.getTestData({}, state);
        state.activeTest = null;
      }

      if (message.payload.name === "testbuilder" || message.payload.name === "componentbuilder") {
        state.commentedActions = state.activeTest.actions.filter((action) => action.description).map((action) => action.id);
      }

      if (message.payload.name === "multiplayback") {
        state.multiPlaybackQueue = message.payload.data.testsToRun ? message.payload.data.testsToRun : state.tests.map((test) => test.testId);
        state.multiPlaybackQueue = state.multiPlaybackQueue.filter((testId) => {
          var test = _.find(state.tests, {id: testId});
          return test && test.type === "test";
        });
        state.multiPlaybackFolderId = message.payload.data.folderNodeId;
        state.multiPlaybackFolderString = message.payload.data.folderString === "all" ? "All Tests" : message.payload.data.folderString;
        state.activeTest = _.find(state.tests, {id: state.multiPlaybackQueue[0]});
        state.multiPlaybackResults = getInitialMultiplaybackResults();
        state.multiPlaybackResults.tests.total = state.multiPlaybackQueue.length;
      }

      if (message.payload.name === "executerun") {
        state.multiPlaybackResults = getInitialMultiplaybackResults();
      }

      if (message.payload.name === "patchrun") {

        state.multiPlaybackQueue = message.payload.data.result.tests.filter((test) => message.payload.data.result.tests_passed.indexOf(test) === -1);

        // prep result to be a patch.
        state.activeResult = message.payload.data.result;
        state.activeResult.content_id = null;
        state.activeResult.patch_of = state.activeResult.id;
        state.activeTest = _.find(state.tests, {id: state.multiPlaybackQueue[0]});

        state.multiPlaybackResults = getInitialMultiplaybackResults();
        state.multiPlaybackResults.patch_tests.total = state.activeResult.tests.length;
        state.multiPlaybackResults.patch_tests.passed = state.activeResult.tests_passed.length;
        state.multiPlaybackResults.patch_tests.failed = state.multiPlaybackQueue.length;

      }

      break;
    case "generateCode":
      state.generatedCode = generators[state.selectedFramework][state.selectedStyle].generate(test, state.components);
      break;
    case "backRoute":

      if (state.viewStack.length < 2) return;

      onPageChange(state);
      state.viewStack.pop();

      var lastRoute = state.viewStack[state.viewStack.length - 1];

      if (lastRoute.name === "dashboard") {
        // state.activeTest = null;
      }

      if (lastRoute.name === "testbuilder" && lastRoute.data.testId) {
        state.activeTest = _.find(state.tests, {id: lastRoute.data.testId});
        if (!state.activeTest) state.activeTest = _.find(state.drafts, {id: lastRoute.data.testId});
      }

      if (lastRoute.name === "componentbuilder" && lastRoute.data.componentId) {
        state.activeTest = _.find(state.components, {id: lastRoute.data.componentId});
        if (!state.activeTest) state.activeTest = _.find(state.drafts, {id: lastRoute.data.testId});
      }

      if (lastRoute.name === "multiplayback") {
        state.multiPlaybackQueue = lastRoute.data.testsToRun;
        state.multiPlaybackFolderString = message.payload.data.folderString === "all" ? "All Tests" : message.payload.data.folderString;
        state.activeTest = _.find(state.tests, {id: state.multiPlaybackQueue[0]});
      }

      break;
    case "setAppRoute":
      state.appRoute = message.payload;
      break;
    case "setCursor":
      state.cursorIndex = message.payload;
      break;
    case "setTestName":

      var draftToUpdate = _.find(state.drafts, {id: message.payload.id});

      if (draftToUpdate) {
        draftToUpdate.name = message.payload.value;
      } else {
        var testToUpdate = _.find(state.tests, {id: message.payload.id});
        testToUpdate.name = message.payload.value;
        autoSave(testToUpdate, state, state.localmode ? false : true);
      }

      break;
    case "setCurrentTestName":
      test.name = message.payload;
      autoSave(test, state);
      break;
    case "setCurrentTestDescription":
      test.description = message.payload.slice(0, 750);
      autoSave(test, state);
      break;

    case "updateRequest":
      if (test && test.type === "request") {

        excludeTestsInResponse = message.payload.optimized;

        var indexOfRequest = _.findIndex(state.tests, {id: test.id});

        if (indexOfRequest !== -1) {
          state.tests.splice(indexOfRequest, 1, message.payload.request);
        }
        state.activeTest = message.payload.request;

        autoSave(state.activeTest, state);

      }
      break;
    case "setComponentName":
      var componentToUpdate = _.find(state.components, {id: message.payload.id});
      componentToUpdate.name = message.payload.value;
      autoSave(componentToUpdate, state);
      break;
    case "updateNWAction":
      updateAction(state, test, message.payload);
      autoSave(test, state);
      break;
    case "removeNWAction":
      if (state.selectedRows.indexOf(message.payload) !== -1) state.selectedRows.splice(state.selectedRows.indexOf(message.payload), 1)
      if (state.playbackBreakpoints.indexOf(message.payload) !== -1) state.playbackBreakpoints.splice(state.playbackBreakpoints.indexOf(message.payload), 1)
      if (state.stepOverBreakpoints.indexOf(message.payload) !== -1) state.stepOverBreakpoints.splice(state.stepOverBreakpoints.indexOf(message.payload), 1)
      removeAction(test, message.payload);
      autoSave(test, state);
      break;
    case "duplicateNWAction":
      duplicateAction(test, message.payload);
      autoSave(test, state);
      break;
    case "shiftUpAction":
      shiftUpAction(test, message.payload);
      autoSave(test, state);
      break;
    case "shiftDownAction":
      shiftDownAction(test, message.payload.sourceId, message.payload.targetId);
      autoSave(test, state);
      break;
    case "moveAction":
      moveAction(test, message.payload.sourceId, message.payload.targetId);
      autoSave(test, state);
      break;
    case "removeNWActions":
      state.cursorIndex = null; // reset cursor
      removeActions(test, state.selectedRows);
      state.selectedRows = [];
      autoSave(test, state);
      break;
    case "insertNWAction":

      if (_.isNumber(message.payload.insertAt)) {
        addAction(state, test, message.payload.action, message.payload.insertAt);
      } else if(_.isNumber(state.cursorIndex)) {
        var oldNWActionsLength = test.actions.length;
        addAction(state, test, message.payload.action, state.cursorIndex + 1);
        state.cursorIndex += (test.actions.length - oldNWActionsLength);
      } else {
        addAction(state, test, message.payload.action)
      }

      autoSave(test, state);

      break;
    case "clearSelectedRows":
      state.selectedRows = [];
      state.recentSelectedIndex = null;
      break;
    case "selectAllRows":
      state.selectedRows = test.actions.map((action) => action.id);
      break;

    case "setSelectedRows":
      state.selectedRows = message.payload.selectedRows;
      if (_.isNumber(message.payload.recentSelectedIndex) && message.payload.recentSelectedIndex > -1) state.recentSelectedIndex = message.payload.recentSelectedIndex;
      break;

    case "indentSelected":
      test.actions.forEach((action) => {
        if (state.selectedRows.indexOf(action.id) !== -1) {
          if (action.indent) action.indent++;
          else action.indent = 1;
        }
      });
      autoSave(test, state);
      break;

    case "unindentSelected":
      test.actions.forEach((action) => {
        if (state.selectedRows.indexOf(action.id) !== -1) {
          if (action.indent && action.indent > 0) action.indent--;
          else action.indent = 0;
        }
      });
      autoSave(test, state);
      break;

    case "commentSelected":

      // if selection has comment, uncomment.
      // otherwise, comment selected.
      var hasComments = false;

      test.actions.forEach((action) => {
        if (state.selectedRows.indexOf(action.id) !== -1) {
          if (action.commented) hasComments = true;
        }
      });

      test.actions.forEach((action) => {
        if (state.selectedRows.indexOf(action.id) !== -1) {
          action.commented = !hasComments;
        }
      });

      autoSave(test, state);

      break;

    case "toggleActionExpanded":
      var indexOfAction = state.expandedActions.indexOf(message.payload);
      if (indexOfAction === -1) state.expandedActions.push(message.payload);
      else state.expandedActions.splice(indexOfAction, 1);
      break;
    case "actionsExpand":
      if (_.isArray(message.payload)) {
        message.payload.forEach((actionId) => {
          if (state.expandedActions.indexOf(actionId) === -1) {
            state.expandedActions.push(actionId);
          }
        })
      }
      break;
    case "actionsShrink":
      if (_.isArray(message.payload)) {
        message.payload.forEach((actionId) => {
          var indexOfActionId = state.expandedActions.indexOf(actionId);
          if (indexOfActionId !== -1) {
            state.expandedActions.splice(indexOfActionId, 1);
          }
        })
      }
      break;
    case "toggleCommentedAction":
      var indexOfAction = state.commentedActions.indexOf(message.payload);
      if (indexOfAction === -1) state.commentedActions.push(message.payload);
      else state.commentedActions.splice(indexOfAction, 1);
      break;
    case "genActionDescription":
      var action = _.find(test.actions, {id: message.payload});
      action.description = Actions.generateDescription(state, action);
      updateAction(state, test, action);
      autoSave(test, state);
      break;
    case "createComponent":
      var newComponent = new Component("New Component");
      state.components.push(newComponent);
      autoSave(newComponent, state);
      break;

    case "addPathAssertSelected":

      testSnapshot(state, state.activeTest);

      var actionsToOptimize = state.activeTest.actions.filter((action) => state.selectedRows.indexOf(action.id !== -1));
      var previousAction = null;
      var nextAction = null;

      actionsToOptimize.forEach((action, idx) => {
        try { nextAction = actionsToOptimize[idx] } catch(e) {};

        if (   idx > 1
            && previousAction
            && (previousAction.type === Actions.URL_CHANGE_INDICATOR || previousAction.type === Actions.PUSHSTATE)
            && action.type !== Actions.PATH_ASSERT
            && action.type !== Actions.FULL_PAGELOAD ) {

          var indexOfOriginal = _.findIndex(state.activeTest.actions, {id: action.id});
          var urlObj = new URL(previousAction.value);
          var newPathAssert = new Actions.PathAssertAction(urlObj.pathname);
          state.activeTest.actions.splice(indexOfOriginal, 0, newPathAssert);
          state.selectedRows.push(newPathAssert.id);

        }

        previousAction = action;
      });

      autoSave(test, state);

      break;

    case "removeDescriptionsSelectedRows":

      testSnapshot(state, state.activeTest);

      state.activeTest.actions.filter((action) => state.selectedRows.indexOf(action.id) !== -1).forEach((action) => {
        action.description = null;
        var indexOfCommentedAction = state.commentedActions.indexOf(action.id);
        if (indexOfCommentedAction !== -1) state.commentedActions.splice(indexOfCommentedAction, 1);
      });

      autoSave(test, state);

      break;

    case "setActionViewTypeSelectedRows":
      if (message.payload === "descriptions") {
        state.selectedRows.forEach((selectedRow) => {
          if (state.commentedActions.indexOf(selectedRow) === -1) {
            state.commentedActions.push(selectedRow)
          }
        });
      }
      else if (message.payload === "actions") {
        state.selectedRows.forEach((selectedRow) => {
          var indexOfCommentedAction = state.commentedActions.indexOf(selectedRow);
          if (indexOfCommentedAction !== -1) {
            state.commentedActions.splice(indexOfCommentedAction, 1);
          }
        });

      }
      break;

    case "setActionViewTypeAllRows":

      if (message.payload === "descriptions") {
        state.commentedActions = state.activeTest.actions.map((action) => action.id);
      }
      else if (message.payload === "actions") {
        state.commentedActions = [];
      }
      break;

    case "autodescribeSelectedRows":

      testSnapshot(state, state.activeTest);

      state.activeTest.actions.filter((action) => state.selectedRows.indexOf(action.id) !== -1).forEach((action) => {
        action.description = Actions.generateDescription(state, action);
        if (state.commentedActions.indexOf(action.id) === -1) state.commentedActions.push(action.id);
      });

      autoSave(test, state);

      break;

    case "createComponentFromSelectedRows":

      testSnapshot(state, state.activeTest);

      // copy rows and put them into a component with a generic name
      var newNWActions = [];
      var insertCompAt = null;
      var newComponent = new Component("New Component");

      test.actions.forEach((action, idx) => {
        if (state.selectedRows.indexOf(action.id) !== -1) {
          if (!insertCompAt) insertCompAt = idx;
            newComponent.actions.push(action);
        } else {
          newNWActions.push(action);
        }
      });

      test.actions = newNWActions;
      if (state.userSettings.drafts) {
        newComponent.draft = true;
        state.drafts.push(newComponent);
      } else {
        state.components.push(newComponent);
      }

      var componentAction = new ComponentAction(newComponent.id);
      addAction(state, test, componentAction, insertCompAt);
      state.selectedRows = [];
      autoSave(test, state);
      autoSave(newComponent, state);

      break;

    case "updateComponent":
      var indexOfComponent = _.findIndex(state.components, {id: message.payload.id});
      state.components.splice(indexOfComponent, 1, message.payload);
      autoSave(state.components[indexOfComponent], state);
      break;
    case "setMinimized":
      state.minimized = message.payload;
      break;
    case "setViewMode":
      state.viewMode = message.payload;
      break;
    case "setMultiplaybackDetails":
      state.multiPlaybackDetails = message.payload;
      break;
    case "undo":
      var priorTestState = getPriorTestState(test);
      if (priorTestState && test.id === priorTestState.id) {

        state.activeTest = test = priorTestState;

        if (test.draft) {
          var testIndex = _.findIndex(state.drafts, {id: test.id});
          state.drafts.splice(testIndex, 1, priorTestState)
        }
        else if (test.type === "test") {
          var testIndex = _.findIndex(state.tests, {id: test.id});
          state.tests.splice(testIndex, 1, priorTestState)
        } else {
          var componentIndex = _.findIndex(state.components, {id: test.id});
          state.tests.splice(componentIndex, 1, priorTestState)
        }

      }
      autoSave(test, state);
      break;
    case "redo":
      var laterTestState = getLaterTestState(test);
      if (laterTestState && laterTestState.id === test.id) {

        state.activeTest = test = laterTestState;
        if (test.draft) {
          var testIndex = _.findIndex(state.drafts, {id: test.id});
          state.drafts.splice(testIndex, 1, laterTestState)
        }
        else if (test.type === "test") {
          var testIndex = _.findIndex(state.tests, {id: test.id});
          state.tests.splice(testIndex, 1, laterTestState)
        } else {
          var componentIndex = _.findIndex(state.components, {id: test.id});
          state.tests.splice(componentIndex, 1, laterTestState)
        }

      }
      autoSave(test, state);
      break;
    case "setViewModeWindowAttr":
      state.viewX = message.payload.viewX;
      state.viewY = message.payload.viewY;
      break;
    case "clearCookies":

      var url = new URL(message.payload);
      var domain = "";

      if (url.hostname !== "localhost") {
        var hostTokens = url.hostname.split(".");
        domain = hostTokens[hostTokens.length - 2] + "." + hostTokens[hostTokens.length - 1];
      } else {
        domain = url.hostname;
      }

      function extrapolateUrlFromCookie(cookie) {
        var prefix = cookie.secure ? "https://" : "http://";
        if (cookie.domain.charAt(0) == ".")
          prefix += "www";

        return prefix + cookie.domain + cookie.path;
      }

      chrome.cookies.getAllCookieStores((stores) => {
        stores.forEach((store) => {
          chrome.cookies.getAll({domain, storeId: store.id}, function(cookies) {
            for(var i=0; i<cookies.length;i++) {
              chrome.cookies.remove({url: extrapolateUrlFromCookie(cookies[i]), name: cookies[i].name, storeId: store.id});
            }
          })
        })
      });

      break;

    case "getState":
      sendResponse(state);
      return;

    case "toggleResultView":

      if (state.resultView === "action") {
        state.resultView = "description"
      } else {
        state.resultView = "action"
      }

      break;

    case "setActionSelectorId":
      state.actionSelectorId = message.payload;
      break;

    case "setShowResultGraph":
      state.showResultGraph = message.payload;
      break;

    case "addAction":
      if (_.isNumber(state.cursorIndex)) {
        var oldNWActionsLength = test.actions.length;
        addRecordedAction(state, test, message.payload, state.cursorIndex + 1);
        state.cursorIndex += (test.actions.length - oldNWActionsLength);
      } else {
        addRecordedAction(state,test, message.payload);
      }

      if (state.userSettings.autodescribe) {
        if (state.commentedActions.indexOf(message.payload.id) === -1) state.commentedActions.push(message.payload.id);
      }

      autoSave(test, state);
      break;
    case "resetTest":
      state.generatedCode = "";
      state.isAssertMode = false;
      state.isRecording = false;
      state.cursorIndex = null;
      break;
  }

  if (getShouldGenCode(state)) state.generatedCode = generators[state.selectedFramework][state.selectedStyle].generate(test, state.components);

  updateComponentInstanceSummary(message.action, state);

  if (excludeTestsInResponse) {
    Message.toAll("stateChange", {...state, tests: [], cause: message.action, testsExcluded: true});
    sendResponse({...state, ...tempResponse, tests: []});
  } else {
    Message.toAll("stateChange", {...state, cause: message.action});
    sendResponse({...state, ...tempResponse});
  }

});

// on new tab opened
chrome.tabs.onActivated.addListener((data) => {
  if ((state.isPlayingBack || state.isRecording) && data.windowId !== state.appWindowId) {
    // Only entered when there are multiple tabs in play, and recording or playing back.
    if (state.activeTabs.length === 0) {
      state.activeTabs = [state.currentTabId]
    }
    if (state.activeTabs[state.activeTabs.length - 1] !== data.tabId) {
      state.activeTabs.push(data.tabId);
    }
    state.currentTabId = data.tabId;
    state.currentWindowId = data.windowId;
    if (state.isRecording) addAction(state, state.activeTest, new Actions.MostRecentTabAction());
    Message.toAll("stateChange", state);
  }
});

// on tab url...
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (tabId === state.currentTabId && state.isRecording && changeInfo.status === "loading") {
    var url = new URL(changeInfo.url);
    addAction(state, state.activeTest, new Actions.UrlChangeIndicatorAction(url.pathname));
    addAction(state, state.activeTest, new Actions.PathAssertAction(url.pathname));
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === state.appWindowId) {
    state.appWindowId = null;
    Message.toAll("stateChange", state);
  }
});

// Runs anytime something connects to the background page.
chrome.runtime.onConnect.addListener(function(devToolsConnection) {

  Message.addDevToolWindow(devToolsConnection);

  devToolsConnection.onDisconnect.addListener((port) => {
    Message.removeDevToolWindow(port);
  });

});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg === 'getTabInfo') {
    sendResponse({tabId: sender.tab.id, currentTabId: state.currentTabId});
  }
});

function updateComponentInstanceSummary(action, state) {

  var whitelist = [
    "insertNWAction",
    "updateNWAction",
    "removeNWAction",
    "duplicateNWAction",
    "repairDirectory",
    "deleteTest",
    "duplicateTest",
    "explodeComponent",
    "redo",
    "undo"
  ];

  if (whitelist.indexOf(action) !== -1) {
    TestActions.buildComponentInstanceSummary({}, state);
  }

}


function shouldOptimizeResponse(action) {

  var optimizeBlackList = [
    "addNewTest",
    "addNewComponent",
    "deleteTest",
    "duplicateTest",
    "repairDirectory",
    "setCurrentTestName",
    "setTestName",
    "generateExamples",
    "setLocalMode",
    "insertNWAction",
    "updateNWAction",
    "removeNWAction",
    "duplicateNWAction",
  ];

  if (optimizeBlackList.indexOf(action) === -1) return true;
  return false;
}

export function upsertDraft(state) {

  if (!state.userSettings.drafts || !state.activeTest) return false;

  var thisDraft = _.find(state.drafts, {id: state.activeTest.id});

  if (!thisDraft) {
    var newDraftTest = deepClone(state.activeTest);
    state.drafts.push(newDraftTest);
    newDraftTest.id = generateId();
    newDraftTest.draft = true;
    newDraftTest.draftOf = state.activeTest.id;
    state.activeTest = newDraftTest;

    if (newDraftTest.type === "component") {
      state.viewStack[state.viewStack.length - 1] = new Route("componentbuilder", { componentId: newDraftTest.id });
    } else {
      state.viewStack[state.viewStack.length - 1] = new Route("testbuilder", { testId: newDraftTest.id })
    }

  }

}

function getShouldGenCode(state) {
  return state.activeTest && (state.viewStack[state.viewStack.length - 1].name === "codeviewer" || state.liveoutput);
}

export function shouldGenDraft(state, message) {

  if (!state.userSettings.drafts || !state.activeTest) return false;

  var actionsThatAlterTests = [
    "setCurrentTestName",
    "setCurrentTestDescription",
    "addVar", "updateVar", "deleteVar",
    "addAction", "redo", "undo",
    "createComponentFromSelectedRows",
    "genActionDescription",
    "insertNWAction",
    "removeNWActions",
    "shiftDownAction",
    "shiftUpAction",
    "moveAction",
    "duplicateNWAction",
    "removeNWAction",
    "updateNWAction",
    "explodeComponent",
    "autodescribeSelectedRows",
    "removeDescriptionsSelectedRows",
    "addPathAssertSelected",
    "setSelection",
    "dismissAllWarningsSelected",
    "indentSelected",
    "unindentSelected",
    "commentSelected"
  ];

  if (actionsThatAlterTests.indexOf(message.action) !== -1) {
    upsertDraft(state);
  }
}

