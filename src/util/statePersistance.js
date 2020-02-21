import _ from 'lodash';
import Message from './Message.js';
import deepClone from 'deep-clone';
import {walkThroughTreeNodes, removeNodeFromTree, findNode} from '../util/treeUtils'
import {generate as generateId} from 'shortid'
import {statusErrorFilter} from '../api/common/apicommons';

import {cacheLocalMode} from '../actions/LocalActions';
import {getTestData} from "../actions/TestActions";
import {getRuns} from "../actions/RunActions";
import {getSettings} from "../actions/SettingsActions";


var saveQueue = [];
var isCurrentlySaving = false;
var state = null;

export function autoSave(_item, _state, forceSave = false) {

  // skip saving if...
  if (!forceSave && (!DB_PERSISTANCE || _state.userSettings.drafts)) return;

  if (_state.localmode) return cacheLocalMode(_state);

  state = _state;
  var item = deepClone(_item);

  var indexOfItemInQueue = _.findIndex(saveQueue, {id: item.id});
  if (indexOfItemInQueue === -1) indexOfItemInQueue = _.findIndex(saveQueue, {type: "directory"});

  if (indexOfItemInQueue === -1) {
    // item is not in the queue yet. add it.
    saveQueue.push(item);

  } else {
    // item is in the queue, but needs updated.
    saveQueue.splice(indexOfItemInQueue, 1, item);
  }

  state.autoSaveStatus = "pending";
  Message.toAll("stateChange", state);

  debouncedSave(state);

}

export function removeItemFromDB(_item, _state, _folderid) {

  if (!DB_PERSISTANCE || _state.localmode) return;

  var item = Object.assign({}, _item);

  if (!!_folderid) item.prev_fid = _folderid;

  var indexOfItemInQueue = _.findIndex(saveQueue, {id: item.id});
  state = _state;

  item.toDelete = true;

  if (indexOfItemInQueue === -1) {
    // item is not in the queue yet. add it.
    saveQueue.push(item);

  } else {
    // item is in the queue, but needs updated.
    saveQueue.splice(indexOfItemInQueue, 1, item);

  }

  state.autoSaveStatus = "pending";
  Message.toAll("stateChange", state);

  debouncedSave(state);


}

export function loadItems(apikey, contextType, contextId) {
  if (!DB_PERSISTANCE) return;

  return fetch(API_URL + `/${contextType}/${contextId}/multiload`, {
    method: "GET",
    headers: { "Content-Type" : "application/json", "apikey": apikey }
  }).then((res) => statusErrorFilter(res)).then((response) => {
    return response.json();
  }).then((body) => {

    var tests = body.tests.filter((test) => test.type === "test" || test.type === "request");
    var components = body.tests.filter((test) => test.type === "component");
    var directory = body.directory;

    return {
      tests,
      components,
      directory,
      dataProfiles: body.envs,
      testsInTags: body.testsInTags
    }
  });
}

function prepItemsForSave() {
  saveQueue = saveQueue.map((item) => {

    if (item.type === "request") {
      item.actions = JSON.stringify({body: item.body, url: item.url, method: item.method});
      item.variables = JSON.stringify(item.variables);
      return {...item}
    }

    if (item.type === "component" || item.type === "test") {
      item.actions = JSON.stringify(item.actions);
      item.variables = JSON.stringify(item.variables);
      return {...item}
    }

    if (item.type === "directory") {
      var newItem = deepClone(item);
      newItem.directory.tree = JSON.stringify(newItem.directory.tree);
      return newItem;
    }
    if (item.type === "dataProfile") {
      item.variables = JSON.stringify(item.variables);
      return {...item}
    }
    if (item.type === "userSettings") {
      item.descriptions = JSON.stringify(item.descriptions);
      return {...item}
    }
    else {
      return {...item};
    }
  })
}

function saveItemsInQueue() {
  return fetch(API_URL + `/${state.contextType}/${state.contextId}/multisave`, {
    method: "POST",
    headers: { "Content-Type" : "application/json", "apikey": state.user.apikey },
    body: JSON.stringify(saveQueue)
  }).then((res) => statusErrorFilter(res)).then((response) => {
    return response.json();
  })
}

var debouncedSave = _.debounce(() => {
  if (!isCurrentlySaving && saveQueue.length > 0) {

    if (state) {
      state.autoSaveStatus = "saving";
      Message.toAll("stateChange", state);
    }

    prepItemsForSave();
    saveItemsInQueue().then(() => {
      if (state) state.autoSaveStatus = "idle";
      Message.toAll("stateChange", state);
    }).catch((e) => {
      if (state) {
        state.autoSaveStatus = "idle";

        // re-load tests if you tried to save and you didn't have access.
        if (e.status === 401) {
          Promise.all([
            getTestData({}, state),
            getRuns({}, state),
            getSettings({}, state)
          ]).then(() => {
            Message.toAll("stateChange", state);
          });
        }
      }

      Message.toAll("stateChange", state);

    });

    saveQueue = [];

  }
}, 1000);

export function repairDirectory(state) {

  var needsReparing = false;

  // Make sure every test and component have nodes on the directory (unless it's inherited)
  state.tests.forEach((test) => {
    var dirNode = findNode(state.directory.tree, {testId: test.id});

    if (!dirNode) {
      needsReparing = true;
      state.directory.tree.children.unshift({ id: generateId(), testId: test.id, type: "test" });
    } else if (!dirNode.type) {
      needsReparing = true;
      dirNode.type = "test";
    } else if (dirNode.type === "component") {
      needsReparing = true;
      dirNode.type = "test";
    }

  });

  state.components.forEach((test) => {
    var dirNode = findNode(state.directory.tree, {testId: test.id});

    if (test.inherited) {}
    else if (!dirNode) {
      needsReparing = true;
      state.directory.tree.children.unshift({ id: generateId(), testId: test.id, type: "component" });
    }
    else if (!dirNode.type) {
      needsReparing = true;
      dirNode.type = "component";
    }
    else if (dirNode.type === "test") {
      needsReparing = true;
      dirNode.type = "component";
    }

  });

  // Eliminate orphan or duplicate directory nodes.
  var nodesToDelete = [];
  var testIdsWithNodes = {};

  walkThroughTreeNodes(state.directory.tree, (node) => {
    if (node.testId) {
      var test = _.find(state.tests, {id: node.testId});
      if (!test) test = _.find(state.components, {id: node.testId});
      if (!test || test.inherited) nodesToDelete.push(node.id);
      if (testIdsWithNodes[node.testId]) nodesToDelete.push(node.id);
      else testIdsWithNodes[node.testId] = node.testId;
    }
  });

  if (nodesToDelete.length > 0) {
    needsReparing = true;
    nodesToDelete.forEach((id) => {
      removeNodeFromTree(state.directory.tree, id);
    })
  }

  if (!state.localmode && needsReparing) autoSave({type: "directory", directory : state.directory}, state, true);
}

export function saveInBatches(apiKey, contextType, contextId, items) {

  var batches = []; // array of arrays
  var currentBatch = 1;
  var entitiesInBatch = 4;

  items.forEach((item, idx) => {
    if ((idx) < (currentBatch * entitiesInBatch)) {
      if (!batches[currentBatch]) batches[currentBatch] = [item];
      else batches[currentBatch].push(item);
    } else {
      currentBatch++;
      if (!batches[currentBatch]) batches[currentBatch] = [item];
      else batches[currentBatch].push(item);
    }
  });

  function pseries(list) {
    var p = Promise.resolve();
    return list.reduce(function(pacc, fn) {
      return pacc = pacc.then(fn);
    }, p);
  }

  return pseries(batches.map((batch) => () => saveItems(apiKey, contextType, contextId, batch)));

}

function saveItems(apiKey, contextType, contextId, items) {

  items = items.map((item) => {
    if (item.type === "request") {
      item.actions = JSON.stringify({body: item.body, url: item.url, method: item.method});
      item.variables = JSON.stringify(item.variables);
      return {...item}
    }
    if (item.type === "component" || item.type === "test") {
      item.actions = JSON.stringify(item.actions);
      item.variables = JSON.stringify(item.variables);
      return {...item}
    }
    if (item.type === "directory") {
      var newItem = deepClone(item);
      newItem.directory.tree = JSON.stringify(newItem.directory.tree);
      return newItem;
    }
    if (item.type === "dataProfile") {
      item.variables = JSON.stringify(item.variables);
      return {...item}
    }
    if (item.type === "userSettings") {
      item.descriptions = JSON.stringify(item.descriptions);
      return {...item}
    }
    else {
      return {...item};
    }
  });

  return fetch(API_URL + `/${contextType}/${contextId}/multisave`, {
    method: "POST",
    headers: { "Content-Type" : "application/json", "apikey": apiKey },
    body: JSON.stringify(items)
  }).then((response) => {
    return response.json();
  })

}
