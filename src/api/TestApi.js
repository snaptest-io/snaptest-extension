import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';
import queryString from 'query-string';

export function getArchivedTests(apikey, ownerType, ownerId) {

  return fetch(`${API_URL}/${ownerType}/${ownerId}/test/archived`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function unarchiveTest(apikey, ownerType, ownerId, testId) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/test/${testId}/unarchive`, {
    method: 'post',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

