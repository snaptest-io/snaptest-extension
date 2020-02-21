import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';
import queryString from 'query-string';

export function getAllEnvs(apikey, ownerType, ownerId, offset, limit, includeProjects = false) {
  return fetch(`${API_URL}/${ownerType}/${ownerId}/environment?${queryString.stringify({offset, limit, includeProjects})}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}
