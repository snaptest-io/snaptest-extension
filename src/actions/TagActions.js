import * as API from '../api'
import _ from 'lodash'
import {generate as generateId} from 'shortid'
import * as LocalActions from './LocalActions';
import * as TestActions from './TestActions';
import {autoSave, removeItemFromDB} from "../util/statePersistance";
import {getTestsInTags} from "./TestActions";

export const getTags = (params, state) => {

  const { contextType, contextId } = state;

  if (state.localmode) {
    state.tagIdtoNameMap = buildTagMap(state.tags);
    return state.tags;
  }

  return API.getAllTags(state.user.apikey, contextType, contextId)
    .then((result) => {
      state.tags = result.items;
      state.tagIdtoNameMap = buildTagMap(result.items);
    });
};

export function buildTagMap(tags) {
  var tagIdtoNameMap = {};
  tags.forEach((tag) => {
    tagIdtoNameMap[tag.id] = tag.name;
  });
  return tagIdtoNameMap
}

export const createTag = (params, state) => {

  const { name, env, folder, integration } = params;
  const { contextType, contextId } = state;

  if (state.localmode) {
    var newTag = params;
    newTag.id = generateId();
    state.tags.push(newTag);
    LocalActions.cacheLocalMode(state);
    return getTags({}, state)
  } else {
    return API.createTag(state.user.apikey, contextType, contextId, name, env, folder, integration)
      .then((result) => getTags({}, state))
  }

};

export const updateTag = (params, state) => {

  const { id, name, env, folder, integration } = params;
  const { contextType, contextId } = state;

  if (state.localmode) {
    var tagIdx = _.findIndex(state.tags, {id});
    if (tagIdx !== -1) state.tags.splice(tagIdx, 1, params);
    LocalActions.cacheLocalMode(state);
    return getTags({}, state)
  }

  return API.updateTag(state.user.apikey, contextType, contextId, id, name, env, folder, integration)
    .then((result) => getTags({}, state))
};

export const deleteTag = (params, state) => {

  const { id, } = params;
  const { contextType, contextId } = state;

  if (state.localmode) {
    var tagIdx = _.findIndex(state.tags, {id});
    if (tagIdx !== -1) state.tags.splice(tagIdx, 1);
    LocalActions.cacheLocalMode(state);
    return getTags({}, state)
  }
  return API.deleteTag(state.user.apikey, contextType, contextId, id)
    .then(() => getTags({}, state))
    .then(() => getTestsInTags({}, state));
};

export const setEditingTag = (params, state) => {
  const { tagId } = params;
  state.editingTag = tagId;
};

export const linkTagsToTests = (params, state) => {

  const { tagIds, testIds } = params;
  const { contextType, contextId } = state;

  if (state.localmode) {

    testIds.forEach((testId) => {
      tagIds.forEach((tagId) => {
        var entity = state.testsInTagsMap[testId];
        if (!entity) {
          state.testsInTagsMap[testId] = [tagId]
        } else {
          if (entity.indexOf(tagId) === -1)
            state.testsInTagsMap[testId].push(tagId);
        }
      })
    });

  } else {
    return API.linkTagToTest(state.user.apikey, contextType, contextId, tagIds, testIds)
      .then(() => TestActions.getTestsInTags(params, state))
  }

};

export const unlinkTagsToTests = (params, state) => {

  const { tagIds, testIds } = params;
  const { contextType, contextId } = state;

  if (state.localmode) {
    testIds.forEach((testId) => {
      tagIds.forEach((tagId) => {
        var entity = state.testsInTagsMap[testId];
        if (entity) {
          var indexOfTag = entity.indexOf(tagId);
          if (indexOfTag !== -1)
            state.testsInTagsMap[testId].splice(indexOfTag, 1);
        }
      })
    });
  } else {
    return API.unlinkTagToTest(state.user.apikey, contextType, contextId, tagIds, testIds)
      .then(() => TestActions.getTestsInTags(params, state))
  }

};

export const createTestsInTagsMap = (testInTags) => {

  var hashMap = {};

  testInTags.forEach((testInTag) => {
    var existingEntry = hashMap[testInTag.test_id];

    if (!existingEntry) {
      hashMap[testInTag.test_id] = [testInTag.tag_id]
    } else {
      hashMap[testInTag.test_id].push(testInTag.tag_id)
    }

  });

  return hashMap;
}