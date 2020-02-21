import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';

export function getProject(apikey, ownerType, ownerId, projectId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/project/${projectId}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function createProject(apikey, ownerType, ownerId, name) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/project`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({name}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function updateProject(apikey, ownerType, ownerId, proId, updatedProject) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/project/${proId}`, {
    method: 'put',
    credentials: 'include',
    body: JSON.stringify(updatedProject),
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function patchProject(apikey, ownerType, ownerId, proId, patch) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/project/${proId}`, {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(patch),
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}


export function archiveProject(apikey, ownerType, ownerId, proId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/project/${proId}/archive`, {
    method: 'post',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function unarchiveProject(apikey, ownerType, ownerId, proId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/project/${proId}/unarchive`, {
    method: 'post',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}