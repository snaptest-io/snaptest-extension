import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';
import queryString from 'query-string';

export function getMyUser(apikey, options) {
  return fetch(`${API_URL}/user/me?${queryString.stringify(options)}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function updateUser(apikey, first, last, email) {
  return fetch(`${API_URL}/user/me`, {
    method: 'put',
    credentials: 'include',
    body: JSON.stringify({first, last, email}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function changePassword(apikey, password) {
  return fetch(`${API_URL}/user/me/password`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({password}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function createOrg(apikey, name, cardToken) {
  return fetch(`${API_URL}/user/me/purchaseOrg`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({name, cardToken}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function getOrgs(apikey, options) {
  return fetch(`${API_URL}/user/me/org?${queryString.stringify(options)}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function getPremium(apikey) {
  return fetch(`${API_URL}/user/me/premium`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function acceptOrgInvite(apikey, token) {
  return fetch(`${API_URL}/acceptinvite?token=${token}`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function purchasePremium(apikey, token) {
  return fetch(`${API_URL}/user/me/purchasePremium`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({token}),
    headers: {...headers, "apikey": apikey}
  })
  .then((res) => statusErrorFilter(apikey, res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function purchaseTeam(apikey, name, addlseats, token) {
  return fetch(`${API_URL}/user/me/purchaseTeam`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({name, addlseats, token}),
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getSubscription(apikey) {
  return fetch(`${API_URL}/user/me/subscription`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function cancelSubscription(apikey, subId) {
  return fetch(`${API_URL}/user/me/subscription/${subId}`, {
    method: 'delete',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function renewSubscription(apikey, subId) {
  return fetch(`${API_URL}/user/me/subscription/${subId}`, {
    method: 'post',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getPaymentMethod(apikey) {
  return fetch(`${API_URL}/user/me/paymentmethod`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function updatePaymentMethod(apikey, token) {
  return fetch(`${API_URL}/user/me/paymentmethod`, {
    method: 'post',
    body: JSON.stringify({token}),
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getCharges(apikey) {
  return fetch(`${API_URL}/user/me/charges`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function getNextInvoice(apikey) {
  return fetch(`${API_URL}/user/me/charges/upcoming`, {
    method: 'get',
    credentials: 'include',
    headers: {...headers, "apikey": apikey}
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function acceptTerms(apikey) {
  return fetch(`${API_URL}/user/me/acceptterms`, {
    method: 'get',
    credentials: 'include',
    headers
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}
