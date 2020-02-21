import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';

export function createProjectGroup(apikey, ownerType, ownerId, name) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/projectGroup`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({name}),
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function updateProjectGroup(apikey, ownerType, ownerId, projGroupId, name) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/projectGroup/${projGroupId}`, {
    method: 'put',
    credentials: 'include',
    body: JSON.stringify({name}),
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function patchProjectGroup(apikey, ownerType, ownerId, projGroupId, patch) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/projectGroup/${projGroupId}`, {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(patch),
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function deleteProjectGroup(apikey, ownerType, ownerId, projGroupId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/projectGroup/${projGroupId}`, {
    method: 'delete',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}
