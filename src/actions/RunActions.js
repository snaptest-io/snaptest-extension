import * as API from '../api'
import _ from 'lodash'
import {generate as generateId} from 'shortid'
import * as LocalActions from './LocalActions';

export const getRuns = (params, state) => {

  const { contextType, contextId, includeProjects } = state;

  if (state.localmode) return state.runs;

  return API.getAllRuns(state.user.apikey, contextType, contextId)
    .then((result) => {
      state.runs = result.runs.items.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    });
};

export const createRun = (params, state) => {

  const { name, env, folder, integration, tags, tags_and } = params;
  const { contextType, contextId } = state;

  if (state.localmode) {
    var newRun = params;
    newRun.id = generateId();
    state.runs.push(newRun);
    LocalActions.cacheLocalMode(state);
  } else {
    return API.createRun(state.user.apikey, contextType, contextId, name, env, folder, tags, tags_and, integration)
      .then((result) => getRuns({}, state))
  }

};

export const updateRun = (params, state) => {

  const { id, name, env, folder, integration, tags, tags_and } = params;
  const { contextType, contextId } = state;

  if (state.localmode) {
    var runIdx = _.findIndex(state.runs, {id});
    if (runIdx !== -1) state.runs.splice(runIdx, 1, params);
    LocalActions.cacheLocalMode(state);
    return;
  }

  return API.updateRun(state.user.apikey, contextType, contextId, id, name, env, folder, tags, tags_and, integration)
    .then((result) => getRuns({}, state))
};

export const deleteRun = (params, state) => {

  const { id, } = params;
  const { contextType, contextId } = state;

  if (state.localmode) {
    var runIdx = _.findIndex(state.runs, {id});
    if (runIdx !== -1) state.runs.splice(runIdx, 1);
    LocalActions.cacheLocalMode(state);
    return;
  }

  return API.deleteRun(state.user.apikey, contextType, contextId, id)
    .then((result) => getRuns({}, state))
};

