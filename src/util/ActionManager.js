import _ from 'lodash';
import * as Actions from '../models/Action';
import deepClone from 'deep-clone'
import {generate as generateId} from 'shortid'
import {StringVariable} from '../models/Variable';
var URL = require('url-parse');

const MAX_UNDO = 20;
var earlierSnapshots = [];
var laterSnapshots = [];

export function getPriorTestState(activeTest) {

  var priorSnapshot = earlierSnapshots[earlierSnapshots.length - 1];

  if (priorSnapshot) {
    if (activeTest.id === priorSnapshot.id) {
      laterSnapshots.push(deepClone(activeTest));
      return earlierSnapshots.pop();
    }
  }

}

export function getLaterTestState(activeTest) {
  var nextSnapshot = laterSnapshots[laterSnapshots.length - 1];

  if (nextSnapshot) {
    if (activeTest.id === nextSnapshot.id) {
      earlierSnapshots.push(deepClone(activeTest));
      return laterSnapshots.pop();
    }
  }
}

function _pushTestSnapshot(test) {

  earlierSnapshots.push(deepClone(test));
  laterSnapshots = [];  // if a new action is added, you lose your redo history

  // make sure not to hold onto too much state
  if (earlierSnapshots.length > MAX_UNDO) {
    earlierSnapshots.shift();
  }

}

export function addAction(state, test, action, insertAt = test.actions.length) {
  _pushTestSnapshot(test);
  test.actions.splice(insertAt, 0, action);
}

export function testSnapshot(state, test) {
  _pushTestSnapshot(test);
}

export function updateAction(state, test, action) {

  var indexOfUpdatedAction = _.findIndex(test.actions, {id: action.id});

  if (indexOfUpdatedAction !== -1) {
    _pushTestSnapshot(test);
    test.actions.splice(indexOfUpdatedAction, 1, action)
  }

}

export function removeActions(test, actionIdsToRemove) {
  _pushTestSnapshot(test);
  test.actions = test.actions.filter((action) => {
    return actionIdsToRemove.indexOf(action.id) === -1;
  });
}

export function removeAction(test, actionId) {

  var actionIndex = _.findIndex(test.actions, {id: actionId});
  if (actionIndex !== -1) {
    _pushTestSnapshot(test);
    test.actions.splice(actionIndex, 1);
  }
  return test;
}

export function duplicateAction(test, actionId) {

  var actionIndex = _.findIndex(test.actions, {id: actionId});

  if (actionIndex !== -1) {
    _pushTestSnapshot(test);
    var newAction = deepClone(test.actions[actionIndex]);
    newAction.id = generateId();
    test.actions.splice(actionIndex, 0, newAction);
  }
  return test;
}

export function shiftUpAction(test, actionId) {


  var actionIndex = _.findIndex(test.actions, {id: actionId});

  if (actionIndex > -1  && actionIndex < test.actions.length - 1) {

    _pushTestSnapshot(test);

    var temp = test.actions[actionIndex];
    test.actions[actionIndex] = test.actions[actionIndex + 1];
    test.actions[actionIndex + 1] = temp;
  }

  return test;
}

export function shiftDownAction(test, actionId) {

  var actionIndex = _.findIndex(test.actions, {id: actionId});

  if (actionIndex > 0) {

    _pushTestSnapshot(test);

    var temp = test.actions[actionIndex];
    test.actions[actionIndex] = test.actions[actionIndex - 1];
    test.actions[actionIndex - 1] = temp;
  }

  return test;
}


export function moveAction(test, sourceId, targetId) {

  var sourceIdx = _.findIndex(test.actions, {id: sourceId});

  function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  };



  if (targetId === "start") {
    _pushTestSnapshot(test);
    array_move(test.actions, sourceIdx, 0);
  }
  if (targetId === "end") {
    _pushTestSnapshot(test);
    array_move(test.actions, sourceIdx, test.actions.length - 1);
  }
  else {
    var targetIdx = _.findIndex(test.actions, {id: targetId});

    if (targetIdx > -1 && targetIdx - sourceIdx >= 0) {
      _pushTestSnapshot(test);
      array_move(test.actions, sourceIdx, targetIdx);
    }
    if (targetIdx > -1 && targetIdx - sourceIdx < 0) {
      _pushTestSnapshot(test);
      array_move(test.actions, sourceIdx, targetIdx + 1)
    }
  }

  return test;
}

export function addRecordedAction(state, test, action, insertAt = test.actions.length) {

  var nwActions = test.actions;

  // if (action.type === Actions.POPSTATE) {
  //   _pushTestSnapshot(test);

    // var thisUrl = new URL(action.value);
    // action.value = action.value.replace(thisUrl.origin, "");

    // nwActions.splice(insertAt, 0, new Actions.UrlChangeIndicatorAction(action.value));
    // nwActions.splice(insertAt, 0, action);
  // }

  if (action.type === Actions.BACK) {
    _pushTestSnapshot(test);
    nwActions.splice(insertAt, 0, action);
  }

  if (action.type === Actions.PUSHSTATE) {
    _pushTestSnapshot(test);

    var thisUrl = new URL(action.value);
    action.value = action.value.replace(thisUrl.origin, "");

    nwActions.splice(insertAt, 0, action);
  }

  if (action.type === Actions.URL_CHANGE_INDICATOR) {
    _pushTestSnapshot(test);

    var thisUrl = new URL(action.value);
    action.value = action.value.replace(thisUrl.origin, "");

    nwActions.splice(insertAt, 0, action);
  }

  if (action.type === Actions.PATH_ASSERT) {
    _pushTestSnapshot(test);

    var thisUrl = new URL(action.value);
    action.value = action.value.replace(thisUrl.origin, "");

    nwActions.splice(insertAt, 0, new Actions.UrlChangeIndicatorAction(action.value));
    nwActions.splice(insertAt + 1, 0, action);
  }

  if (action.type === Actions.FULL_PAGELOAD) {
    _pushTestSnapshot(test);

    var thisUrl = new URL(action.value);
    var currentBaseUrl = _.find(test.variables, {name: "baseUrl"});

    if (!currentBaseUrl) {
      var baseUrlVariable = new StringVariable("baseUrl", thisUrl.origin);
      test.variables.push(baseUrlVariable);
    } else if (currentBaseUrl.defaultValue !== thisUrl.origin) {
      currentBaseUrl.defaultValue = thisUrl.origin;
    }

    action.value = action.value.replace(thisUrl.origin, "${baseUrl}");

    nwActions.splice(insertAt, 0, new Actions.UrlChangeIndicatorAction(action.value.replace("${baseUrl}", "")));
    nwActions.splice(insertAt + 1, 0, action);
  }

  if (action.type === Actions.MOUSEDOWN) {
    _pushTestSnapshot(test);
    nwActions.splice(insertAt, 0, action);
  }

  if (action.type === Actions.SUBMIT) {
    _pushTestSnapshot(test);
    nwActions.splice(insertAt, 0, action);
  }

  if (action.type === Actions.KEYDOWN) {

    switch (action.keyValue) {
      case "Enter":
        _pushTestSnapshot(test);
        nwActions.splice(insertAt, 0, action);
        break;
      case "Escape":
        _pushTestSnapshot(test);
        nwActions.splice(insertAt, 0, action);
        break;
    }

  }

  if (action.type === Actions.INPUT && action.inputType === "SELECT") {
    _pushTestSnapshot(test);
    nwActions.splice(insertAt, 0, action);
  }

  if (action.type === Actions.INPUT) {

    if (nwActions[insertAt - 1] && nwActions[insertAt - 1].type === Actions.INPUT) {

      if (nwActions[insertAt - 1].selector === action.selector) {

        nwActions[insertAt - 1].value = action.value;

      } else {
        _pushTestSnapshot(test);
        nwActions.splice(insertAt, 0, action);
      }
    } else {
      _pushTestSnapshot(test);
      nwActions.splice(insertAt, 0, action);
    }

  }

  if (action.type === Actions.TEXT_ASSERT) {
    _pushTestSnapshot(test);
    nwActions.splice(insertAt, 0, action);
  }

  if (action.type === Actions.VALUE_ASSERT) {
    _pushTestSnapshot(test);
    nwActions.splice(insertAt, 0, action);
  }

  if (action.type === Actions.EL_PRESENT_ASSERT) {
    _pushTestSnapshot(test);
    nwActions.splice(insertAt, 0, action);
  }

  if (state.userSettings.autodescribe) {
    action.description = Actions.generateDescription(state, action);
    state.commentedActions.push(action.id);
  }

}
