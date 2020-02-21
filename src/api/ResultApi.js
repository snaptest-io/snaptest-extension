import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';
import queryString from 'query-string';
import deepClone from 'deep-clone'

export function getResults(apikey, ownerType, ownerId, filters = {}, limit = 5, offset = 0) {

  var queryObject = getQueryReadyResultFilterObject(filters);

  queryObject.orderby = "id";
  queryObject.orderdir = "desc";
  queryObject.limit = limit;
  queryObject.offset = offset;

  return fetch(`${API_URL}/${ownerType}/${ownerId}/result?${queryString.stringify(queryObject)}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

function getQueryReadyResultFilterObject(filters) {

  var transformedQueries = deepClone(filters);

  if (transformedQueries.combos) {
    transformedQueries.combos = transformedQueries.combos.map((combo) => combo.tags.map((tag) => "t_" + tag).join("|"))
  }

  if (transformedQueries.runIds) {
    transformedQueries.run_ids = transformedQueries.runIds;
    delete transformedQueries.runIds;
  }

  if (transformedQueries.projectIds) {
    transformedQueries.project_ids = transformedQueries.projectIds;
    delete transformedQueries.projectIds;
  }

  if (transformedQueries.runnerIds) {
    transformedQueries.runner_ids = transformedQueries.runnerIds;
    delete transformedQueries.runnerIds;
  }

  if (transformedQueries.applyTimeFilter && transformedQueries.timeStart) {
    transformedQueries.created_after = transformedQueries.timeStart / 1000;
    delete transformedQueries.timeStart;
  } else {
    delete transformedQueries.timeStart;
  }

  if (transformedQueries.applyTimeFilter && transformedQueries.timeEnd) {
    transformedQueries.created_before = transformedQueries.timeEnd / 1000;

    delete transformedQueries.timeEnd;
  } else {
    delete transformedQueries.timeEnd;
  }

  delete transformedQueries.applyTimeFilter;

  return transformedQueries;

}

export function getResultsOverview(apikey, ownerType, ownerId, filters = {}) {

  var queryObject = getQueryReadyResultFilterObject(filters);

  return fetch(`${API_URL}/${ownerType}/${ownerId}/result/overview?${queryString.stringify(queryObject)}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getResultContent(apikey, ownerType, ownerId, contentId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/c/${contentId}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function createResult(apikey, ownerType, ownerId, result) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/result`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({ownerType, ownerId, ...result}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function archiveResult(apikey, ownerType, ownerId, resultId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/result/${resultId}/archive`, {
    method: 'post',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function unarchiveResult(apikey, ownerType, ownerId, resultId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/result/${resultId}/unarchive`, {
    method: 'post',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

