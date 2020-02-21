import _ from 'lodash'
import * as API from '../api'
import {getTestData} from "./TestActions";
import {getSettings} from "./SettingsActions";
import {cacheLocalMode} from './LocalActions'
import Message from '../util/Message'
import {getRuns} from "./RunActions";
import {expandAllProjectGroups} from "./ProjectGroupActions";
import Route from "../models/Route";
import {getTags} from "./TagActions";
import {initialResultFilters} from './ResultFilterActions'
import {buildIdToFieldMap} from '../util/util'
import {switchDraftContexts} from "../managers/DraftManager";

export const switchToOrg = (params, state) => {

  const { orgId } = params;

  switchDraftContexts("org", orgId, state);

  if (state.localmode) cacheLocalMode(state);
  state.localmode = false;
  state.autoSaveStatus = "idle";
  state.selectedOrg = _.find(state.orgs, { id: orgId });
  state.selectedProject = null;
  state.contextType = "org";
  state.contextId = orgId;
  state.premium = true;
  state.isSwitchingContext = true;
  state.activeTest = null;
  state.activeResult = null;
  state.projectReadAccessDenied = false;
  state.resultFilters = initialResultFilters();


  var currentRoute = state.viewStack[state.viewStack.length - 1];

  if (currentRoute.name === "testbuilder" || currentRoute.name === "componentbuilder" || currentRoute.name === "codeviewer") {
    state.viewStack = [new Route("dashboard")];
  } else {
    if (currentRoute.name === "auth") state.viewStack = [new Route("dashboard")];
    else state.viewStack = [state.viewStack[state.viewStack.length - 1]];
  }

  Message.toAll( "stateChange", {...state });

  // if (currentRoute.name === "results") Promise.all([getResults({}, state), getResultsOverview({}, state)]);

  return getProjectsAndGroups({}, state)
    .then(() => getTestData({}, state))
    .then(() => getRuns({}, state))
    .then(() => getTags({}, state))
    .then(() => getSettings({}, state))
    .then(() => state.expandedProjectGroups.length === 0 ? expandAllProjectGroups({}, state) : new Promise.resolve())
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

export const getCurrentOrg = (params, state) => {
  return API.getOrg(state.user.apikey, state.selectedOrg.id)
    .then((result) => {
      state.selectedOrg = result.org;
    });
};

export const getProjects = (params, state) => {
  return API.getProjects(state.user.apikey, state.selectedOrg.id)
    .then((result) => {
      state.projects = result.projects.items.map((project) => ({
        id: project.id,
        name: project.name,
        tests: project.tests,
        archived: project.archived === 1,
        project_group: project.project_group,
        permissions: project.permissions
      }));
    });
};

export const getCollaborators = (params, state) => {
  return API.getCollaborators(state.user.apikey, state.selectedOrg.id)
    .then((result) => {
      state.collaborators = result.collaborators.items.sort((a, b) => a.email.toLowerCase() > b.email.toLowerCase() ? 1 : -1 );
    });
};

export const getProjectsAndGroups = (params, state) => {

  var promises = [
    API.getProjects(state.user.apikey, state.selectedOrg.id),
    API.getProjectGroups(state.user.apikey, state.selectedOrg.id)
  ];

  return Promise.all(promises)
    .then((result) => {

      state.projects = result[0].projects.items.map((project) => ({
        id: project.id,
        name: project.name,
        tests: project.tests,
        archived: project.archived === 1,
        project_group: project.project_group,
        permissions: project.permissions
      }));

      state.projectGroups = result[1].projectGroups.items.map((projectGroup) => ({
        id: projectGroup.id,
        name: projectGroup.name,
        parent: projectGroup.parent
      }));

    });
};