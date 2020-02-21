import _ from 'lodash'
import {walkThroughTreeNodes, walkUpAncestors, findNode} from './treeUtils'
import {ActionsByConstant} from '../generators/_shared/ActionTruth'

export function safeIterateOverActions(test, tests, components, cb = _.noop) {

  var MAX_ITERATIONS = 2000;
  var currentIteration = 0;

  function searchContext(actionList) {

    for (var i = 0; i < actionList.length; i++) {

      currentIteration++;
      if (currentIteration > MAX_ITERATIONS) return;

      var action = actionList[i];
      cb(action);

      if (action.type === "component") {
        var component = _.find(components, {id: action.componentId});
        if (component) searchContext(component.actions);
      }

    }
  }

  searchContext(test.actions)

};

export function countActions(test, state) {

  var components = state.components;
  var actionCount = 0;
  if (!test) return actionCount;

  function iterate(actionList) {

    actionList.forEach((action) => {
      if (action.type === "COMPONENT") {
        var component = _.find(components, {id: action.componentId});
        if (component) iterate(component.actions);
      } else {
        actionCount++;
      }
    })

  }

  iterate(test.actions);

  return actionCount;

}

export function countReportableActions(test, state) {

  var components = state.components;
  var actionCount = 0;
  if (!test) return actionCount;

  function iterate(actionList) {

    actionList.forEach((action) => {
      if (action.type === "COMPONENT") {
        var component = _.find(components, {id: action.componentId});
        if (component) iterate(component.actions);
      } else if (ActionsByConstant[action.type] && ActionsByConstant[action.type].reportResult) {
        actionCount++;
      }
    })

  }

  iterate(test.actions);

  return actionCount;

}

export function buildPathString(test, tree) {

  var node = findNode(tree, {testId: test.id});
  var path = "";

  if (!node) return "";

  walkUpAncestors(tree, node.id, (node) => {
    if (node.module !== "tests" && !node.topLevel) path = node.module + " -> " + path;
  });

  return path;

}

export function buildFolderString(folderId, tree) {

  var node = findNode(tree, {id: folderId});
  var path = "";

  if (!node) return "";

  path = node.module;

  walkUpAncestors(tree, folderId, (node) => {
    if (node.module !== "tests" && !node.topLevel) path = node.module + " -> " + path;
  });

  return path;

}

export function findAction(test, identifier) {
  var result = null;

  test.actions.forEach((action) => {

    for (var i in identifier) {
      if (action[i] === identifier[i]) result = action;
    }

    if (_.isObject(action.value)) {
      for (var i in identifier) {
        if (action.value[i] === identifier[i]) result = action.value;
      }
    }

  });

  return result;
};