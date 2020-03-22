const POLLING_INTERVAL = 300;
import _ from 'lodash';
var URL = require('url-parse');
import Message from '../../util/Message'
import {saveScreenshot} from "../ScreenshotManager";
const uuidv4 = require('uuid/v4');

export const playbackActions = {
  "FULL_PAGELOAD" : { perform: (tabId, action, state) =>                   pageLoad(tabId, action, state)},
  "PAGELOAD" : { perform: (tabId, action, state) =>                        pageLoad(tabId, action, state)},
  "PATH_ASSERT" : { perform: (tabId, action, state) =>                     pathAssert(tabId, action, state)},
  "BACK" : { perform: (tabId, action, state) =>                            back(tabId, action, state)},
  "REFRESH" : { perform: (tabId, action, state) =>                         refresh(tabId, action, state)},
  "FORWARD" : { perform: (tabId, action, state) =>                         forward(tabId, action, state)},
  "CLEAR_COOKIES" : { perform: (tabId, action, state) =>                   clearCookies(tabId, action, state)},
  "CLEAR_CACHES" : { perform: (tabId, action, state) =>                    clearCaches(tabId, action, state)},
  "DYNAMIC_VAR" : { perform: (tabId, action, state, subroutine, other) =>
    dynamicVar(tabId, action, state, subroutine, other.derivedVariables, other.dynamicVars)},
  "INPUT" : { perform: (tabId, action, state) =>                           changeInput(tabId, action, state)},
  "DIALOG" : { perform: (tabId, action, state) =>                          setDialogs(tabId, action, state)},
  "MOUSEDOWN" : { perform: (tabId, action, state) =>                       click(tabId, action, state)},
  "DOUBLECLICK" : { perform: (tabId, action, state) =>                     doubleClick(tabId, action, state)},
  "FOCUS" : { perform: (tabId, action, state) =>                           focus(tabId, action, state)},
  "BLUR" : { perform: (tabId, action, state) =>                            blur(tabId, action, state)},
  "PAUSE" : { perform: (tabId, action, state) =>                           pauseTime(tabId, action, state)},
  "SUBMIT" : { perform: (tabId, action, state) =>                          submit(tabId, action, state)},
  "EXECUTE_SCRIPT" : { perform: (tabId, action, state) =>                  executeCustomScript(tabId, action, state)},
  "SCROLL_WINDOW" : { perform: (tabId, action, state) =>                   scrollWindow(tabId, action, state)},
  "SCROLL_ELEMENT" : { perform: (tabId, action, state) =>                  scrollElement(tabId, action, state)},
  "SCROLL_WINDOW_ELEMENT" : { perform: (tabId, action, state) =>           scrollWindowtoEl(tabId, action, state)},
  "EL_PRESENT_ASSERT" : { perform: (tabId, action, state) =>               elementIsPresent(tabId, action, state)},
  "EL_NOT_PRESENT_ASSERT" : { perform: (tabId, action, state) =>           elementIsNotPresent(tabId, action, state)},
  "EL_VISIBLE_ASSERT" : { perform: (tabId, action, state) =>               elementIsVisible(tabId, action, state)},
  "EL_NOT_VISIBLE_ASSERT" : { perform: (tabId, action, state) =>           elementIsNotVisible(tabId, action, state)},
  "TEXT_ASSERT" : { perform: (tabId, action, state) =>                     textAssert(tabId, action, state)},
  "TEXT_REGEX_ASSERT" : { perform: (tabId, action, state) =>               textRegexAssert(tabId, action, state)},
  "VALUE_ASSERT" : { perform: (tabId, action, state) =>                    valueAssert(tabId, action, state)},
  "STYLE_ASSERT" : { perform: (tabId, action, state) =>                    styleAssert(tabId, action, state)},
  "SCREENSHOT" : { perform: (tabId, action, state) =>                      screenshot(tabId, action, state)},
  "REQUEST" : { perform: (tabId, action, state) =>                         request(tabId, action, state)},
  "EVAL" : { perform: (tabId, action, state, subroutine, other) =>
    evalAmbiguous(tabId, action, state, subroutine, other.derivedVariables, other.dynamicVars)},
  "CSV_INSERT" : { perform: (tabId, action, state, subroutine, other) =>
    insertCsvRow(tabId, action, state, subroutine, other.derivedVariables, other.dataVars)},
};

/*
  Helper methods:
*/

var executeScript = (code, tabId) => new Promise((resolve, reject) => {
  chrome.tabs.executeScript(tabId, {code}, (result, error) => {
    if (typeof result === "undefined") return resolve({success: false});
    else if (error) return reject(error);
    else return resolve(...result);
  });
});

var waitOnExecuteScriptSuccess = (tabId, action, state, execute) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _execute() {
    execute(tabId, action, state).then((result) => {
      if (result && result.success) resolve(result);
      else if (currentAttempt < attempts) {
        currentAttempt++;
        setTimeout(() => _execute(tabId, action, state), POLLING_INTERVAL)
      } else {
        resolve(result);
      }
    }).catch((e) => reject(e));
  }

  _execute();

});

var callExecuteFunction = (name, params) => {
  return `if (typeof window.${name} !== "undefined") window.${name}(${params})`;
}

var checkForElement = (tabId, action, state) => executeScript(callExecuteFunction("checkElement", JSON.stringify(action)), tabId);
var checkForElementVisible = (tabId, action, state) => executeScript(callExecuteFunction("checkElementVisible", JSON.stringify(action)), tabId);

var waitForElementPresent = (tabId, action, state) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _checkElementPresent() {

    checkForElement(tabId, action, state).then((element) => {
      if (element && element.success) resolve(true);
      else if (currentAttempt < attempts) {
        currentAttempt++;
        setTimeout(() => _checkElementPresent(), POLLING_INTERVAL)
      } else {
        resolve(false);
      }
    }).catch((e) => {
      reject(e)
    });

  }

  _checkElementPresent();

});

var waitForElementNotPresent = (tabId, action, state) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _checkElementNotPresent() {

    checkForElement(tabId, action, state).then((result) => {

      if (!result || !result.success) {
        resolve(true);
      } else if (currentAttempt < attempts) {
        currentAttempt++;
        setTimeout(() => _checkElementNotPresent(), POLLING_INTERVAL)
      } else {
        resolve(false);
      }

    }).catch((e) => {
      reject(e)
    });

  }

  _checkElementNotPresent();

});

var waitForElementVisible = (tabId, action, state) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _checkElementVisible() {

    checkForElementVisible(tabId, action, state).then((element) => {
      if (element && element.success) resolve(true);
      else if (currentAttempt < attempts) {
        currentAttempt++;
        setTimeout(() => _checkElementVisible(), POLLING_INTERVAL)
      } else {
        resolve(false);
      }
    }).catch((e) => {
      reject(e)
    });

  }

  _checkElementVisible();

});

var waitForElementNotVisible = (tabId, action, state) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _checkElementNotVisible() {

    checkForElementVisible(tabId, action, state).then((result) => {
      if (result && !result.success) {
        resolve(true);
      } else if  (currentAttempt < attempts) {
        currentAttempt++;
        setTimeout(() => _checkElementNotVisible(), POLLING_INTERVAL)
      } else {
        resolve(false);
      }
    }).catch((e) => {
      reject(e)
    });

  }

  _checkElementNotVisible();

});

var clearCookiesByUrl = (_url) => new Promise((resolve, reject) => {
  var url = new URL(_url);
  var domain = "";

  if (url.hostname !== "localhost") {
    var hostTokens = url.hostname.split(".");
    domain = hostTokens[hostTokens.length - 2] + "." + hostTokens[hostTokens.length - 1];
  } else {
    domain = url.hostname;
  }

  function extrapolateUrlFromCookie(cookie) {
    var prefix = cookie.secure ? "https://" : "http://";
    if (cookie.domain.charAt(0) == ".")
      prefix += "www";

    return prefix + cookie.domain + cookie.path;
  }

  chrome.cookies.getAllCookieStores((stores) => {
    stores.forEach((store) => {

      chrome.cookies.getAll({domain, storeId: store.id}, function(cookies) {
        for(var i=0; i<cookies.length;i++) {
          chrome.cookies.remove({url: extrapolateUrlFromCookie(cookies[i]), name: cookies[i].name, storeId: store.id});
        }
      });

      setTimeout(() => resolve({success: true}), 10)

    })
  });
});

var elementNotFoundMessage = (action) => `Couldn't find element '${action.selector}' using method '${action.selectorType}'.`;

/*
  Actions:
*/

var pageLoad = (tabId, action, state) => new Promise((resolve, reject) => {

  var loaded = false;

  chrome.tabs.onUpdated.addListener(function (tabId , info, tab) {
    if (tabId === tab.id && state.isPlayingBack && !loaded && ( !action.complete || info.status === 'complete')) {
      loaded = true;
      state.playbackResult[action.id] = {processing: false, success: true };
      if (action.resize) {
        chrome.windows.update(state.currentWindowId, {width: action.width, height: action.height, state: "normal"}, () => {
          Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
          resolve({success: true});
        });
      } else {
        Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
        resolve({success: true});
      }
    }
  });

  chrome.tabs.get(tabId, (tab) => {

    var tabUrl = new URL(tab.url);
    var targetUrl = new URL(action.value);

    // check actions value.  in case of a relative path,  it'll show "chrome-extension:" as protocol.  In this case, add the proper baseUrl
    if (targetUrl.protocol === "chrome-extension:") {
      targetUrl = new URL(action.value, tabUrl.origin);
    }

    chrome.tabs.update(tabId, {url: targetUrl.href});

  });
})

var pathAssert = (tabId, action, state) =>
  waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) => executeScript(callExecuteFunction("pathAssert", JSON.stringify(action)), tabId))
    .then((result) => {
      if (!result || !result.success) return { success: false, error: `Expected path to be "${action.value}" but was "${result.value}"` };
      else return { success: true };
    });

var elementIsPresent = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action)} : { success : true });

var elementIsNotPresent = (tabId, action, state) =>
  waitForElementNotPresent(tabId, action, state).then((result) => !result ? { success: false, error: "Element was found." } : { success: true });

var elementIsVisible = (tabId, action, state) =>
  waitForElementVisible(tabId, action, state)
    .then((result) => {

      if (!result) return {
        success: false, error: `Element was not visible for the duration of the timeout.`
      };

      else return { success: true };

    });

var elementIsNotVisible = (tabId, action, state) =>
  waitForElementNotVisible(tabId, action, state)
    .then((result) => {

      if (!result) return {
        success: false, error: `Element was visible for the duration of the timeout.`
      };

      else return { success: true };

    });

var back = (tabId, action, state) => executeScript(`window.triggerBack(${JSON.stringify(action)})`, tabId).then(() => ({ success: true }));

var forward = (tabId, action, state) => executeScript(`window.triggerForward(${JSON.stringify(action)})`, tabId).then(() => ({ success: true }));

var refresh = (tabId, action, state) => executeScript(`window.triggerRefresh(${JSON.stringify(action)})`, tabId).then(() => ({ success: true }));

var clearCookies = (tabId, action, state) => clearCookiesByUrl(action.value);

var clearCaches = (tabId, action, state) =>
  clearCookiesByUrl(action.cookieDomain)
    .then(() => executeScript(`window.clearCaches(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var dynamicVar = (tabId, action, state, subroutine, derivedVariables, dynamicVars) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.getInnerHtml(${JSON.stringify(action)})`, tabId)
      .then((result) => {
        dynamicVars[action.value] = result.value;
        return {success: true}
      }));

var click = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerClick(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var doubleClick = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerDoubleClick(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var focus = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerFocus(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var blur = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerBlur(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var changeInput = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerChangeInput(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var setDialogs = (tabId, action, state) =>
  waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) =>  executeScript(`window.setDialogs(${JSON.stringify(action)})`, tabId))
    .then(() => ({ success: true }));

var pauseTime = (tabId, action, state) => new Promise((resolve, reject) => setTimeout(() => resolve({success: true}), action.value));

var submit = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerSubmit(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var executeCustomScript = (tabId, action, state) =>
  waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) => executeScript(`window.executeScript(${JSON.stringify(action)})`, tabId))
    .then((result) => {
      if (!result || !result.success) return { success: false, error: result.message };
      else return { success: true };
    });

var scrollWindow = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerScrollWindow(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var scrollElement = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerScrollElement(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var scrollWindowtoEl = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerWindowToElement(${JSON.stringify(action)})`, tabId).then(() => ({ success: true })));

var textAssert = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) => executeScript(`window.assertText(${JSON.stringify(action)})`, tabId))
      .then((result) => {
        if (!result || !result.success) return { success: false, error: `Expected text to be "${action.value}" but was "${result.value}"` };
        else return { success: true };
      }));

var textRegexAssert = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) => executeScript(`window.assertTextRegex(${JSON.stringify(action)})`, tabId))
      .then((result) => {
        if (!result || !result.success) return { success: false, error: `Expected text to match regex "${action.value}" but was "${result.value}"` };
        else return { success: true };
      }));

var valueAssert = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) => executeScript(`window.assertValue(${JSON.stringify(action)})`, tabId))
      .then((result) => {
        if (!result || !result.success) return { success: false, error: `Expected value to be "${action.value}" but was "${result.value}"` };
        else return { success: true };
      }));

var styleAssert = (tabId, action, state) =>
  waitForElementPresent(tabId, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) => executeScript(`window.assertStyle(${JSON.stringify(action)})`, tabId))
      .then((result) => {
        if (!result || !result.success) return { success: false, error: `Expected "${action.style}" style to be "${action.value}" but was "${result.value}"` };
        else return { success: true };
      }));

// Iframe for safe evalling.
var evalIframe = document.createElement('iframe');
evalIframe.style.display = "none";
evalIframe.src = "eval.html";
document.body.appendChild(evalIframe);

var evalInIframe = (value, derivedVariables, dynamicVars) => {
  return new Promise((resolve, reject) => {

    var result;
    var currentPoll = 0;

    var response = (e) => {
      result = e.data;
    };

    window.addEventListener('message', response);

    evalIframe.contentWindow.postMessage({value, variables: derivedVariables, dynamicVars}, '*');

    function pollForResponse() {
      if (!result && currentPoll < 5) {
        setTimeout(pollForResponse, 1000)
      } else if (result) {
        window.removeEventListener('message', response);
        resolve(result);
      } else {
        window.removeEventListener('message', response);
        resolve({success: false})
      }
    }

    setTimeout(pollForResponse, 5);

  })
};


var evalAmbiguous = (tabId, action, state, subroutine, derivedVariables, dynamicVars) =>
  waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) =>
    executeScript(`window.evalValue(${JSON.stringify(action.value)}, ${JSON.stringify(derivedVariables)}, ${JSON.stringify(dynamicVars)})`, tabId))
    .then((result) => {

      // Eval succeeded in the target window.
      if (result && result.result) {

        if (result.dynamicVars) Object.assign(dynamicVars, result.dynamicVars);

        if (!result.success)
          return {
            success: false,
            error: `Eval returned an error: "${result.result}" `
        };

        if (result.result === "false") {
          return { success: false, error: `Eval returned false` };
        } else {
          return { success: true};
        }

      }

      // Eval didn't run in target window, and needs to be evalled in an iframe.
      return evalInIframe(action.value, derivedVariables, dynamicVars).then((result) => {

        if (result.dynamicVars) Object.assign(dynamicVars, result.dynamicVars);

        if (!result.success)
          return {
            success: false,
            error: `Eval returned an error: "${result.result}" `
          };

        if (result.result === "false") {
          return { success: false, error: `Eval returned false` };
        } else {
          return { success: true};
        }

      })


    });

var insertCsvRow = (tabId, action, state, subroutine, derivedVariables, dataVars) => new Promise((resolve, reject) => {

  waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) =>
    executeScript(`window.getCsvValues(${JSON.stringify(action)})`, tabId))
    .then((result) => {

      var csvName = action.csvName;
      var columns = action.columns;

      if (!dataVars[csvName]) dataVars[csvName] = [columns.map((column) => column.columnName)];

      if (result) {
        dataVars[csvName].push(result.results);
      }

      return {success: true};

    });

  return resolve({ success: true});
});

var screenshot = (tabId, action, state) =>
  waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) => executeScript(callExecuteFunction("hideSnapUI", JSON.stringify(action)), tabId))
    .then(() => new Promise((resolve, reject) => {

      chrome.tabs.captureVisibleTab(state.currentWindowId, { format: 'jpeg', quality: 70 }, (dataURI, error) => {

        var uuid = uuidv4();
        action.screenshot = uuid;

        saveScreenshot(dataURI, uuid).then(() => {
          return resolve({ success: true});
        });
      })

  })).then(() => executeScript("window.showSnapUI()", tabId));

var request = (tabId, action, state) => new Promise((resolve, reject) => {

  // at this point, we can call the request from the background page, or attempt to call it from the context script.
  // let's try both!!!

  // var request = _.find(state.tests, {id: action.reqId});

  // if (!request) return resolve({success: false});

  var response, headers = {};

  action.request.headers.forEach((header) => { headers[header.key] = header.value; });

  var options = {
    method: action.request.method,
    headers,
    credentials: 'include'
  };

  if (action.request.body) options.body = action.request.body;

  return fetch(action.request.url, options).then((r) => {
    response = r;
    return response.text();
  }).then((body) => {
    if (action.reportResult) {
      state.recentRequestResult = {status: response.status, body};
    }
    return resolve({success: true})
  }).catch((e) => {
    if (action.reportResult) {
      state.recentRequestResult = {status: e.message};
    }
    return resolve({success: true})
  });

  // waitOnExecuteScriptSuccess(tabId, action, state, (tabId, action, state) =>
  //   executeScript(`window.sendRequest(${JSON.stringify(action)})`, tabId))
  //   .then((result) => {
  //     return resolve({success: true})
  //     // return {success: true};
  //   });
});