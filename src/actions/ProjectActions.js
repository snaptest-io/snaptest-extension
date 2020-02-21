import _ from 'lodash'
import {getTestData} from "./TestActions";
import {getProjects} from "./OrgActions";
import {cacheLocalMode} from './LocalActions';
import * as API from "../api"
import {getSettings} from "./SettingsActions";
import Message from '../util/Message'
import {getRuns} from "./RunActions";
import Route from "../models/Route";
import {getTags} from "./TagActions";
import {initialResultFilters} from './ResultFilterActions'
// import {getResults, getResultsOverview} from './ResultActions'
import {switchDraftContexts} from '../managers/DraftManager'

export const switchToProject = (params, state) => {

  const { proId } = params;

  switchDraftContexts("project", proId, state);

  if (state.localmode) cacheLocalMode(state);
  state.localmode = false;
  state.autoSaveStatus = "idle";
  state.contextType = "project";
  state.contextId = proId;
  state.selectedProject = _.find(state.projects, {id: proId});
  state.premium = true;
  state.isSwitchingContext = true;
  state.projectReadAccessDenied = false;
  state.resultFilters = initialResultFilters();
  state.activeResult = null;

  var currentRoute = state.viewStack[state.viewStack.length - 1];

  if (currentRoute.name === "testbuilder" || currentRoute.name === "componentbuilder" || currentRoute.name === "codeviewer") {
    state.viewStack = [new Route("dashboard")];
  } else {
    if (currentRoute.name === "auth") state.viewStack = [new Route("dashboard")];
    else state.viewStack = [state.viewStack[state.viewStack.length - 1]];
  }

  // if (currentRoute.name === "results") Promise.all([getResults({}, state), getResultsOverview({}, state)]);

  Message.toAll( "stateChange", {...state });

  return getTestData({}, state)
    .then(() => getRuns({}, state))
    .then(() => getTags({}, state))
    .then(() => getProjects({}, state))
    .then(() => getSettings({}, state))
    .then(() => {
      state.isSwitchingContext = false;
      Message.toAll( "stateChange", {...state })
    })
    .catch((e) => {
      state.isSwitchingContext = false;
      if (e.status === 401) state.projectReadAccessDenied = true;
      Message.toAll( "stateChange", {...state })
    })

};

export const getCurrentProject = (params, state) => {
  return API.getProject(state.user.apikey, "org", state.selectedOrg.id, state.selectedProject.id)
    .then((result) => {
      state.selectedProject = result.project;
    });
};

export const createProject = (params, state) => {

  const { name } = params;

  return API.createProject(state.user.apikey, "org", state.selectedOrg.id, name);

};

export const updatePermissions = (params, state) => {
  const { contextType, contextId, permissions } = params;

  if (contextType === "org") {

    // state in orgAccounts
    // state in orgs
    // state in selectedOrg

    return API.patchOrg(state.user.apikey, contextId, {permissions});
  } else {

    // state in orgAccounts
    // state in projects
    // state in selectedProject

    return patchProject({proId: contextId, patch: {permissions}}, state);

  }

};

export const updateProject = (params, state) => {

  const { proId, name } = params;

  var project = _.find(state.projects, {id: proId});
  project.name = name;

  if (state.selectedProject && state.selectedProject.id === proId) {
    state.selectedProject.name = name;
  }

  return API.updateProject(state.user.apikey, "org", state.selectedOrg.id, proId, state.selectedProject);

};

export const patchProject = (params, state) => {

  const { proId, patch } = params;

  var projectIdx = _.findIndex(state.projects, {id: proId});

  if (projectIdx !== -1) {
    state.projects.splice(projectIdx, 1, Object.assign(state.projects[projectIdx], patch));

    if (state.selectedProject && state.selectedProject.id === state.projects[projectIdx].id) {
      state.selectedProject = state.projects[projectIdx];
    }

    return API
      .patchProject(state.user.apikey, "org", state.selectedOrg.id, proId, patch);

  }

};

export const archiveProject = (params, state) => {

  const { proId } = params;

  return API.archiveProject(state.user.apikey, "org", state.selectedOrg.id, proId);

};

export const unarchiveProject = (params, state) => {

  const { proId } = params;

  return API.unarchiveProject(state.user.apikey, "org", state.selectedOrg.id, proId);

};