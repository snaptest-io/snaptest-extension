import _ from 'lodash'

import Moment from 'moment'
import {generate as generateId} from 'shortid'

export const clearResultFilters = (params, state) => {
  return new Promise((resolve, reject) => {
    state.resultFilters = initialResultFilters();
    resolve();
  })
};

export const addResultFilter = (params, state) => {
  return new Promise((resolve, reject) => {

    const { filterType, filterEntity } = params;
    const { resultFilters } = state;

    if (filterType === "run") {
      var idxOfRun = resultFilters["runIds"].indexOf(filterEntity.id);
      if (idxOfRun === -1) resultFilters["runIds"].push(filterEntity.id);
    }

    if (filterType === "tag-combo") {

      var idxOfCombo = -1;

      resultFilters.combos.forEach((combo, idx) => {
        if (combo.tags.length === 1 && combo.tags[0] === filterEntity.id)
          idxOfCombo = idx;
      });

      if (idxOfCombo === -1) resultFilters.combos.push({
        id: generateId(),
        tags: [filterEntity.id],
        folderId: null,
        envId: null
      });

    }

    if (filterType === "project") {
      var idxOfRun = resultFilters["projectIds"].indexOf(filterEntity.id);
      if (idxOfRun === -1) resultFilters["projectIds"].push(filterEntity.id);
    }

    if (filterType === "dates") {
      resultFilters.timeStart = filterEntity.timeStart;
      resultFilters.timeEnd = filterEntity.timeEnd;
    }

    if (filterType === "runner") {
      var idxOfRun = resultFilters["runnerIds"].indexOf(filterEntity.user_id);
      if (idxOfRun === -1) resultFilters["runnerIds"].push(filterEntity.user_id);
    }

    resolve();

  })
};

export const removeResultFilter = (params, state) => {
  return new Promise((resolve, reject) => {

    const { comboId, runId, projectId, runnerId } = params;
    const { resultFilters } = state;

    if (runId) {
      var idxOfRun = resultFilters.runIds.indexOf(runId);
      if (idxOfRun !== -1) resultFilters.runIds.splice(idxOfRun, 1);
    }

    if (comboId) {
      var idxOfCombo = _.findIndex(resultFilters.combos, {id: comboId});
      if (idxOfCombo !== -1) resultFilters.combos.splice(idxOfCombo, 1);
    }

    if (projectId) {
      var idxOfProject = resultFilters.projectIds.indexOf(projectId);
      if (idxOfProject !== -1) resultFilters.projectIds.splice(idxOfProject, 1);
    }

    if (runnerId) {
      var idxOfRunner = resultFilters.runnerIds.indexOf(runnerId);
      if (idxOfRunner !== -1) resultFilters.runnerIds.splice(idxOfRunner, 1);
    }

    resolve();

  })
};

export const applyTimeFilter = (params, state) => {
  return new Promise((resolve, reject) => {

    const { value } = params;
    const { resultFilters } = state;

    resultFilters.applyTimeFilter = value;

    if (resultFilters.applyTimeFilter && !resultFilters.timeStart) resultFilters.timeStart = Moment().startOf("month").valueOf();
    if (resultFilters.applyTimeFilter && !resultFilters.timeEnd) resultFilters.timeEnd = Moment().endOf("day").valueOf();

    resolve();

  })
};

export const initialResultFilters = () => {
  return {
    runnerIds: [],
    projectIds: [],
    combos: [],
    runIds: [],
    duration: 0,
    timeStart: null,
    timeEnd: null,
    applyTimeFilter: false
  }
}