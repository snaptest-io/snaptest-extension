
export function execIntegration(integration, result) {
  if (integration && integration.type) {
    if (integration.type === "WEBHOOK") {
      webhookIntegration(
        integration.url,
        integration.headers,
        integration.method,
        integration.body,
        result
      )
    }
  }
}

export function simulateWebhookIntegration(url, headers, method, body, success) {

  var results = {};

  if (success) {
    results.tests = ["result1", "result2"];
    results.message = "success";
    results.success = true;
  } else {
    results.tests = ["result1", "result2"];
    results.message = "failure";
    results.success = false;
  }

  return webhookIntegration(url, headers, method, body, results)

}

export function webhookIntegration(url, headers, method, body, _results) {
  var results = _results;
  return new Promise((resolve, reject) => {

    var sHeaders = "", sBody = "";
    var regArrayResult = new RegExp("\\$\\{arrayResult\\}", "g");
    var regStringMessage = new RegExp("\\$\\{stringMessage\\}", "g");
    var regBoolSuccess = new RegExp("\\$\\{boolSuccess\\}", "g");

    try {
      sHeaders = headers.replace(regArrayResult, JSON.stringify(results.tests));
      sHeaders = sHeaders.replace(regStringMessage, results.message);
      sHeaders = sHeaders.replace(regBoolSuccess, JSON.stringify(results.success));
      sHeaders = JSON.parse(sHeaders);
    } catch(e) {
      return reject("Error parsing your headers. Check your JSON syntax.");
    }

    try {
      sBody = body.replace(regArrayResult, JSON.stringify(results.tests));
      sBody = sBody.replace(regStringMessage, results.message);
      sBody = sBody.replace(regBoolSuccess, JSON.stringify(results.success));
      sBody = JSON.parse(sBody);
    } catch(e) {
      return reject("Error parsing your body. Check your syntax.");
    }

    var options = {
      method, headers: sHeaders
    }

    if (method === "post" || method === "put") {
      options.body = JSON.stringify(sBody);
    }

    fetch(url, {
      method: 'POST',
      headers: sHeaders,
      body: options.body
    }).then((response) => {
      if (response.status === 200) return;
      else {
        reject(`Webhook error: status code of ${response.status}. (${url})`);
      }
    }).then(() => {
      resolve(`Successfully simulated a ${results.success ? "passing test run" : "failing test run"}.`);
    }).catch((e) => {
      reject(`Webhook error: Connection issue - ${e}. (${url})`);
    })
  })
}