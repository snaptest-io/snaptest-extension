import _ from 'lodash'
import * as API from "../api"

export const createProjectGroup = (params, state) => {
  const { name } = params;
  return API.createProjectGroup(state.user.apikey, "org", state.selectedOrg.id, name);
};

export const updateProjectGroup = (params, state) => {

  const { projectGroupId, name } = params;

  var projectGroup = _.find(state.projectGroups, {id: projectGroupId});
  projectGroup.name = name;

  return API.updateProjectGroup(state.user.apikey, "org", state.selectedOrg.id, projectGroupId, name);

};

export const patchProjectGroup = (params, state) => {
  const { projectGroupId, patch } = params;
  return API.patchProjectGroup(state.user.apikey, "org", state.selectedOrg.id, projectGroupId, patch);
};

export const deleteProjectGroup = (params, state) => {
  const { projectGroupId } = params;
  return API.deleteProjectGroup(state.user.apikey, "org", state.selectedOrg.id, projectGroupId);
};

export const toggleExpandedProjectGroup = (params, state) => {
  const { projectGroupId } = params;

  var expandedProjectGroupIdx = state.expandedProjectGroups.indexOf(projectGroupId);

  if (expandedProjectGroupIdx !== -1) {
    state.expandedProjectGroups.splice(expandedProjectGroupIdx, 1)
  } else {
    state.expandedProjectGroups.push(projectGroupId)
  }

};


export const expandAllProjectGroups = (params, state) => {

  const { projectGroups } = state;

  state.expandedProjectGroups = [];

  projectGroups.forEach((projectGroup) => {
    state.expandedProjectGroups.push(projectGroup.id)
  })

};