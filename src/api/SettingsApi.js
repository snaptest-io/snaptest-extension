import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';

export function getSettings(apikey, ownerType, ownerId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/settings`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function updateSetting(apikey, ownerType, ownerId, key, value) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/settings`, {
    method: 'put',
    credentials: 'include',
    body: JSON.stringify({key, value}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}