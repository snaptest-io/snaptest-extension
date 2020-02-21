import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';
import queryString from 'query-string';

export function getAllTags(apikey, ownerType, ownerId, offset, limit, includeProjects = false) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/tag?${queryString.stringify({offset, limit, includeProjects})}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function createTag(apikey, ownerType, ownerId, name, env, folder, integration) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/tag`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({ownerType, ownerId, name, env, folder, integration}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function updateTag(apikey, ownerType, ownerId, tagId, name, env, folder, integration) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/tag/${tagId}`, {
    method: 'put',
    credentials: 'include',
    body: JSON.stringify({name, env, folder, integration}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function deleteTag(apikey, ownerType, ownerId, tagId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/tag/${tagId}`, {
    method: 'delete',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function linkTagToTest(apikey, ownerType, ownerId, tagIds = [], testIds = []) {

  return fetch(`${API_URL}/${ownerType}/${ownerId}/tag/link`, {
    method: 'post',
    body: JSON.stringify({tag_ids: tagIds, test_secondary_ids: testIds}),
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function unlinkTagToTest(apikey, ownerType, ownerId, tagIds = [], testIds = []) {

  return fetch(`${API_URL}/${ownerType}/${ownerId}/tag/unlink`, {
    method: 'post',
    body: JSON.stringify({tag_ids: tagIds, test_secondary_ids: testIds}),
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getTestsInTags(apikey, ownerType, ownerId) {

  return fetch(`${API_URL}/${ownerType}/${ownerId}/testsintags`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}
