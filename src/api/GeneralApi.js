import {statusErrorFilter, apiErrorFilter, headers} from './common/apicommons';

export function emailSignup(email, category) {
  return fetch(`${API_URL}/emailsignup`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({email, category}),
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function enquiry(email, question) {
  return fetch(`${API_URL}/enquiry`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({email, question}),
    headers
  })
  .then((res) => statusErrorFilter(res))
  .then((res) => res.json())
  .then((res) => apiErrorFilter(res))
}

export function reportError(error, category, severity, localmode, contextType, contextId) {

  var body = {error, category, severity, agent: "EXTENSION"};

  if (localmode) {
    body.contextType = "localmode";
  } else if (contextType && contextId) {
    body.contextType = contextType;
    body.contextId = contextId;
  }

  return fetch(`${API_URL}/e`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify(body),
    headers
  })
    .then((res) => statusErrorFilter(res))
    .then((res) => res.json())
    .then((res) => apiErrorFilter(res))
}
