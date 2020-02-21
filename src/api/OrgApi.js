import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';

export function getOrg(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function updateOrg(apikey, orgId, name, shortName, timezone) {
  return fetch(`${API_URL}/org/${orgId}`, {
    method: 'put',
    credentials: 'include',
    body: JSON.stringify({name, shortName, timezone}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function patchOrg(apikey, orgId, patch) {
  return fetch(`${API_URL}/org/${orgId}`, {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(patch),
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function createInvite(apikey, orgId, email) {
  return fetch(`${API_URL}/org/${orgId}/invite`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({orgId, email, redirectUrl: `${window.location.origin}/account/acceptinvite/`}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function getAllInvites(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}/invite`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function resendInvite(apikey, orgId, invId) {
  return fetch(`${API_URL}/org/${orgId}/invite/${invId}/resend`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function cancelInvite(apikey, orgId, invId) {
  return fetch(`${API_URL}/org/${orgId}/invite/${invId}`, {
    method: 'delete',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function getCollaborators(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}/collaborator`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function updateCollaborator(apikey, orgId, colId, role) {
  return fetch(`${API_URL}/org/${orgId}/collaborator/${colId}`, {
    method: 'update',
    credentials: 'include',
    body: JSON.stringify({role}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function addNewDefaultCard(apikey, orgId, token) {
  return fetch(`${API_URL}/org/${orgId}/paymentmethod`, {
    method: 'post',
    body: JSON.stringify({token}),
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function deleteCollaborator(apikey, orgId, colId) {
  return fetch(`${API_URL}/org/${orgId}/collaborator/${colId}`, {
    method: 'delete',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function deleteOrg(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}`, {
    method: 'delete',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function getOrgSubscription(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}/subscription`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function cancelOrgSubscription(apikey, orgId, subId) {
  return fetch(`${API_URL}/org/${orgId}/subscription/${subId}`, {
    method: 'delete',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function renewOrgSubscription(apikey, orgId, subId) {
  return fetch(`${API_URL}/org/${orgId}/subscription/${subId}`, {
    method: 'post',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getOrgPaymentMethod(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}/paymentmethod`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function updateOrgPaymentMethod(apikey, orgId, token) {
  return fetch(`${API_URL}/org/${orgId}/paymentmethod`, {
    method: 'post',
    body: JSON.stringify({token}),
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getOrgCharges(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}/charges`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getOrgNextInvoice(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}/charges/upcoming`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getProjects(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}/project`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getProjectGroups(apikey, orgId) {
  return fetch(`${API_URL}/org/${orgId}/projectGroup`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}
