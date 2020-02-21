import queryString from 'query-string';
import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';

export function register(email, password, password2, agreedtoterms) {
  return fetch(`${API_URL}/register`, {
    method: 'post',
    body: JSON.stringify({email, password, password2, agreedtoterms, redirectUrl: MARKETING_URL + "/account/verify"}),
    credentials: 'include',
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function login(email, password, options = {}) {
  var query = queryString.stringify(options);
  return fetch(`${API_URL}/login?${query}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({email, password}),
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function sudoLogin(email, options = {}) {
  var query = queryString.stringify(options);
  return fetch(`${API_URL}/sudologin?${query}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({email}),
    headers
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}

export function logout() {
  return fetch(`${API_URL}/user/me/logout`, {
    method: 'get',
    credentials: 'include',
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function resendVerifyEmail(userId, redirectUrl) {
  return fetch(`${API_URL}/resendverify`, {
    method: 'post',
    body: JSON.stringify({userId, redirectUrl}),
    credentials: 'include',
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function verifyAccount(token, userId) {
  return fetch(`${API_URL}/verify?${queryString.stringify({token, userId})}`, {
    method: 'get',
    credentials: 'include',
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function forgotPassword(email, redirectUrl) {
  return fetch(`${API_URL}/forgotpassword`, {
    method: 'post',
    body: JSON.stringify({email, redirectUrl}),
    credentials: 'include',
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function resetPassword(token, password) {
  return fetch(`${API_URL}/resetpassword`, {
    method: 'post',
    body: JSON.stringify({token, password}),
    credentials: 'include',
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}
