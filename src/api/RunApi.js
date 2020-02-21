import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';
import queryString from 'query-string';

export function getOneRun(apikey, ownerType, ownerId, runId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/run/${runId}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function getAllRuns(apikey, ownerType, ownerId, offset, limit, includeProjects = false) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/run?${queryString.stringify({offset, limit, includeProjects})}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function createRun(apikey, ownerType, ownerId, name, env, folder, tags, tags_and, integration) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/run`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({ownerType, ownerId, name, env, folder, tags, tags_and, integration}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function updateRun(apikey, ownerType, ownerId, runId, name, env, folder, tags, tags_and, integration) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/run/${runId}`, {
    method: 'put',
    credentials: 'include',
    body: JSON.stringify({name, env, folder, integration, tags, tags_and}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function deleteRun(apikey, ownerType, ownerId, runId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/run/${runId}`, {
    method: 'delete',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}
