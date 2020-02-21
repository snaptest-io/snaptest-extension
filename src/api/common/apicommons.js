export function statusErrorFilter(res) {
  if (res.status === 401) {
    return Promise.reject({status: 401, message: "You do not have sufficient permissions to complete this action."});
  } else if (res.status === 500) {
    return Promise.reject({status: 500, message: "There was an issue connecting with our services. Please try again."});
  } else {
    return res;
  }
}

export function apiErrorFilter(body) {
  if (!body.success) {
    return Promise.reject(body);
  } else {
    return body;
  }
}

export const headers = {'Content-Type': 'application/json', "X-Requested-With": "XMLHttpRequest"};
