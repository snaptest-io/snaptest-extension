import * as API from '../api'
import {uploadScreenshots} from "../api/ScreenshotApi";
import {getScreenshots, flagScreenshotsForDeletion} from "../managers/ScreenshotManager";
import {buildIdToFieldMap, dataURItoBlob} from "../util/util";
import Message from "../util/Message";

export const setActiveResult = (params, state) => {
  return new Promise((resolve, reject) => {
    const { result } = params;
    state.activeResult = result;
    resolve()
  })
};

export const getResultContent = (params, state) => {

  const { ownerType, ownerId, contentId} = params;

  return API.getResultContent(state.user.apikey, ownerType, ownerId, contentId)
    .then((result) => result.content);

}

export const getResults = (params, state) => {
  return API.getResults(state.user.apikey, state.contextType, state.contextId, state.resultFilters, 200)
    .then((response) => {
      return {
        results: response.items,
        continues: response.continues
      }
    });
};

export const getAllResults = (params, state) => {
  return API.getResults(state.user.apikey, state.contextType, state.contextId, state.resultFilters, 10000)
    .then((response) => {
      return response.items;
    });
};

export const getResultEnvs = (params, state) => {
  if (state.selectedOrg) {
    return API.getAllEnvs(state.user.apikey, state.contextType, state.contextId, 0, 2000, true)
      .then((response) => {

        var projectMap = buildIdToFieldMap(state.projects, "id", "name");

        if (state.contextType === "org")
          state.resultEnvIdToNameMap = buildIdToFieldMap(
            response.items, 'profileId',
            (item) => (item.owner_type === "project" && projectMap[item.owner_id]) ? `(${projectMap[item.owner_id]}) ${item.name}` : item.name
          );
        else state.resultEnvIdToNameMap = buildIdToFieldMap(response.items, 'profileId', 'name')

      });
  } else {
    state.resultEnvIdToNameMap = buildIdToFieldMap(state.dataProfiles, 'id', 'name');
  }
};

export const getResultRunners = (params, state) => {
  if (state.selectedOrg) {
    return API.getCollaborators(state.user.apikey, state.selectedOrg.id)
      .then((response) => {
        state.resultRunnerIdToEmailMap = buildIdToFieldMap(response.collaborators.items, 'user_id', 'email');
      });
  } else {
    state.resultRunnerIdToEmailMap = {[state.user.id] : state.user.email}
  }
};

export const getResultRuns = (params, state) => {
  if (state.selectedOrg) {
    return API.getAllRuns(state.user.apikey, state.contextType, state.contextId, 0, 2000, true)
      .then((response) => {

        var projectMap = buildIdToFieldMap(state.projects, "id", "name");

        if (state.contextType === "org")
          state.resultRunIdToNameMap = buildIdToFieldMap(
            response.runs.items,
            'id',
            (item) => (item.owner_type === "project" && projectMap[item.owner_id]) ? `(${projectMap[item.owner_id]}) ${item.name}` : item.name
          );
        else state.resultRunIdToNameMap = buildIdToFieldMap(response.runs.items, 'id', 'name');

      });
  } else {
    state.resultRunIdToNameMap = buildIdToFieldMap(state.runs, 'id', 'name');
  }
};

export const getResultTags = (params, state) => {
  if (state.selectedOrg) {
    return API.getAllTags(state.user.apikey, state.contextType, state.contextId, 0, 2000, true)
      .then((response) => {

        var projectMap = buildIdToFieldMap(state.projects, "id", "name");

        if (state.contextType === "org")
          state.resultTagIdToNameMap = buildIdToFieldMap(
            response.items, 'id',
            (item) => (item.owner_type === "project" && projectMap[item.owner_id]) ? `(${projectMap[item.owner_id]}) ${item.name}` : item.name
          );
        else state.resultTagIdToNameMap = buildIdToFieldMap(response.items, 'id', 'name')

      });
  } else {
    state.resultTagIdToNameMap = buildIdToFieldMap(state.tags, 'id', 'name');
  }
};

export const getMoreResults = (params, state) => {

  const { offset } = params;

  return API.getResults(state.user.apikey, state.contextType, state.contextId, state.resultFilters, 200, offset)
    .then((response) => {
      return {
        results: response.items,
        continues: response.continues
      }
    });
};

export const getResultsOverview = (params, state) => {
  return API.getResultsOverview(state.user.apikey, state.contextType, state.contextId, state.resultFilters)
    .then((result) => result.items);
};

export const addResult = (params, state) => {

  var result = null;
  const MAX_SS_UPLOAD_COUNT = 3;

  state.resultUploaded = 0;
  Message.toAll("stateChange", {...state});

  return API.createResult(state.user.apikey, state.contextType, state.contextId, params.result)
    .then((response) => {
      result = response.result;

      var screenshotBlobs = getScreenshots().map((screenshot) => {
        return {
          blob: dataURItoBlob(screenshot.uri),
          uuid: screenshot.uuid
        }
      });

      state.resultUploaded = screenshotBlobs.length > 0 ? 25 : 100;
      Message.toAll("stateChange", {...state});

      return uploadScreenshots(state.user.apikey, state.contextType, state.contextId, screenshotBlobs, result.id, MAX_SS_UPLOAD_COUNT,
        (percent) => {
          state.resultUploaded += (percent * 75);
          Message.toAll("stateChange", {...state});
        }
      )

    }).then(() => {

      state.resultUploaded = 0;
      Message.toAll("stateChange", {...state});

      var uploadedScreenshots = getScreenshots().map((ss) => ss.uuid);
      flagScreenshotsForDeletion(uploadedScreenshots);

      return result;
    })
};

export const archiveResult = (params, state) =>
  API.archiveResult(state.user.apikey, state.contextType, state.contextId, params.resultId);

export const unarchiveResult = (params, state) =>
  API.unarchiveResult(state.user.apikey, state.contextType, state.contextId, params.resultId);

export const stagePendingResult = (params, state) => {
  const { pendingResult } = params;
  state.activeResult = pendingResult;
};

export const savePendingResult = (params, state) => {
  return addResult({result: state.activeResult}, state).then((result) => {
    state.activeResult = result;
  });
};

export const getScreenshotsCache = (params, state) => {
  return getScreenshots();
};

export const setResultActionRowView = (params, state) => {
  const { viewtype } = params;
  state.resultActionRowView = viewtype;
};

