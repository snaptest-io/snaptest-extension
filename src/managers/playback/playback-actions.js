const POLLING_INTERVAL = 300;
import _ from 'lodash';
var URL = require('url-parse');
import Message from '../../util/Message'
import {saveScreenshot} from "../ScreenshotManager";
const uuidv4 = require('uuid/v4');

export const playbackActions = {
  "FULL_PAGELOAD" : { perform: (tabId, frameStack, action, state) =>                   pageLoad(tabId, frameStack, action, state)},
  "PAGELOAD" : { perform: (tabId, frameStack, action, state) =>                        pageLoad(tabId, frameStack, action, state)},
  "PATH_ASSERT" : { perform: (tabId, frameStack, action, state) =>                     pathAssert(tabId, frameStack, action, state)},
  "BACK" : { perform: (tabId, frameStack, action, state) =>                            back(tabId, frameStack, action, state)},
  "REFRESH" : { perform: (tabId, frameStack, action, state) =>                         refresh(tabId, frameStack, action, state)},
  "FORWARD" : { perform: (tabId, frameStack, action, state) =>                         forward(tabId, frameStack, action, state)},
  "CLEAR_COOKIES" : { perform: (tabId, frameStack, action, state) =>                   clearCookies(tabId, frameStack, action, state)},
  "CLEAR_CACHES" : { perform: (tabId, frameStack, action, state) =>                    clearCaches(tabId, frameStack, action, state)},
  "DYNAMIC_VAR" : { perform: (tabId, frameStack, action, state, subroutine, other) =>
    dynamicVar(tabId, frameStack, action, state, subroutine, other.derivedVariables, other.dynamicVars)},
  "INPUT" : { perform: (tabId, frameStack, action, state) =>                           changeInput(tabId, frameStack, action, state)},
  "DIALOG" : { perform: (tabId, frameStack, action, state) =>                          setDialogs(tabId, frameStack, action, state)},
  "MOUSEDOWN" : { perform: (tabId, frameStack, action, state) =>                       click(tabId, frameStack, action, state)},
  "DOUBLECLICK" : { perform: (tabId, frameStack, action, state) =>                     doubleClick(tabId, frameStack, action, state)},
  "FOCUS" : { perform: (tabId, frameStack, action, state) =>                           focus(tabId, frameStack, action, state)},
  "BLUR" : { perform: (tabId, frameStack, action, state) =>                            blur(tabId, frameStack, action, state)},
  "PAUSE" : { perform: (tabId, frameStack, action, state) =>                           pauseTime(tabId, frameStack, action, state)},
  "SUBMIT" : { perform: (tabId, frameStack, action, state) =>                          submit(tabId, frameStack, action, state)},
  "EXECUTE_SCRIPT" : { perform: (tabId, frameStack, action, state) =>                  executeCustomScript(tabId, frameStack, action, state)},
  "SCROLL_WINDOW" : { perform: (tabId, frameStack, action, state) =>                   scrollWindow(tabId, frameStack, action, state)},
  "SCROLL_ELEMENT" : { perform: (tabId, frameStack, action, state) =>                  scrollElement(tabId, frameStack, action, state)},
  "SCROLL_WINDOW_ELEMENT" : { perform: (tabId, frameStack, action, state) =>           scrollWindowtoEl(tabId, frameStack, action, state)},
  "EL_PRESENT_ASSERT" : { perform: (tabId, frameStack, action, state) =>               elementIsPresent(tabId, frameStack, action, state)},
  "EL_NOT_PRESENT_ASSERT" : { perform: (tabId, frameStack, action, state) =>           elementIsNotPresent(tabId, frameStack, action, state)},
  "EL_VISIBLE_ASSERT" : { perform: (tabId, frameStack, action, state) =>               elementIsVisible(tabId, frameStack, action, state)},
  "EL_NOT_VISIBLE_ASSERT" : { perform: (tabId, frameStack, action, state) =>           elementIsNotVisible(tabId, frameStack, action, state)},
  "TEXT_ASSERT" : { perform: (tabId, frameStack, action, state) =>                     textAssert(tabId, frameStack, action, state)},
  "TEXT_REGEX_ASSERT" : { perform: (tabId, frameStack, action, state) =>               textRegexAssert(tabId, frameStack, action, state)},
  "VALUE_ASSERT" : { perform: (tabId, frameStack, action, state) =>                    valueAssert(tabId, frameStack, action, state)},
  "STYLE_ASSERT" : { perform: (tabId, frameStack, action, state) =>                    styleAssert(tabId, frameStack, action, state)},
  "SCREENSHOT" : { perform: (tabId, frameStack, action, state) =>                      screenshot(tabId, frameStack, action, state)},
  "REQUEST" : { perform: (tabId, frameStack, action, state) =>                         request(tabId, frameStack, action, state)},
  "ENTER_FRAME" : { perform: (tabId, frameStack, action, state) =>                     enterFrame(tabId, frameStack, action, state)},
  "EXIT_FRAME" : { perform: (tabId, frameStack, action, state) =>                      exitFrame(tabId, frameStack, action, state)},
  "EVAL" : { perform: (tabId, frameStack, action, state, subroutine, other) =>
    evalAmbiguous(tabId, frameStack, action, state, subroutine, other.derivedVariables, other.dynamicVars)},
  "CSV_INSERT" : { perform: (tabId, frameStack, action, state, subroutine, other) =>
    insertCsvRow(tabId, frameStack, action, state, subroutine, other.derivedVariables, other.dataVars)},
};

/*
  Helper methods:
*/

var executeScript = (code, tabId, frameStack, state) => new Promise((resolve, reject) => {
  const frameId = frameStack.length > 0 ? frameStack[frameStack.length - 1] : 0
  chrome.tabs.executeScript(tabId, { code, frameId }, (result, error) => {
    if (typeof result === "undefined") return resolve({success: false});
    else if (error) return reject(error);
    else return resolve(...result);
  });
});

var waitOnExecuteScriptSuccess = (tabId, frameStack, action, state, execute) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _execute() {
    execute(tabId, frameStack, action, state).then((result) => {
      if (result && result.success) resolve(result);
      else if (currentAttempt < attempts) {
        currentAttempt++;
        setTimeout(() => _execute(tabId, frameStack, action, state), POLLING_INTERVAL)
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

var checkForElement = (tabId, frameStack, action, state) => executeScript(callExecuteFunction("checkElement", JSON.stringify(action)), tabId, frameStack, state, state.frameStack);
var checkForElementVisible = (tabId, frameStack, action, state) => executeScript(callExecuteFunction("checkElementVisible", JSON.stringify(action)), tabId, frameStack, state);

var waitForElementPresent = (tabId, frameStack, action, state) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _checkElementPresent() {

    checkForElement(tabId, frameStack, action, state).then((element) => {
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

var waitForElementNotPresent = (tabId, frameStack, action, state) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _checkElementNotPresent() {

    checkForElement(tabId, frameStack, action, state).then((result) => {

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

var waitForElementVisible = (tabId, frameStack, action, state) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _checkElementVisible() {

    checkForElementVisible(tabId, frameStack, action, state).then((element) => {
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

var waitForElementNotVisible = (tabId, frameStack, action, state) => new Promise((resolve, reject) => {

  var timeout = action.timeout || state.userSettings.globalTimeout;
  var attempts = parseInt(timeout / POLLING_INTERVAL);
  var currentAttempt = 0;

  function _checkElementNotVisible() {

    checkForElementVisible(tabId, frameStack, action, state).then((result) => {
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

var enterFrame = (tabId, frameStack, action, state) => new Promise((resolve, reject) => {
  chrome.webNavigation.getAllFrames({tabId}, (frames) => {
    const frameId = frames.find((frame) => frame.url === action.value).frameId
    if (frameId) {
      frameStack.push(frameId)
      resolve({success: true});
    }
  });
})

var exitFrame = (tabId, frameStack, action, state) => new Promise((resolve, reject) => {
  frameStack.pop()
  resolve({success: true});
})

var pageLoad = (tabId, frameStack, action, state) => new Promise((resolve, reject) => {

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

var pathAssert = (tabId, frameStack, action, state) =>
  waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) => executeScript(callExecuteFunction("pathAssert", JSON.stringify(action)), tabId, frameStack, state))
    .then((result) => {
      if (!result || !result.success) return { success: false, error: `Expected path to be "${action.value}" but was "${result.value}"` };
      else return { success: true };
    });

var elementIsPresent = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action)} : { success : true });

var elementIsNotPresent = (tabId, frameStack, action, state) =>
  waitForElementNotPresent(tabId, frameStack, action, state).then((result) => !result ? { success: false, error: "Element was found." } : { success: true });

var elementIsVisible = (tabId, frameStack, action, state) =>
  waitForElementVisible(tabId, frameStack, action, state)
    .then((result) => {

      if (!result) return {
        success: false, error: `Element was not visible for the duration of the timeout.`
      };

      else return { success: true };

    });

var elementIsNotVisible = (tabId, frameStack, action, state) =>
  waitForElementNotVisible(tabId, frameStack, action, state)
    .then((result) => {

      if (!result) return {
        success: false, error: `Element was visible for the duration of the timeout.`
      };

      else return { success: true };

    });

var back = (tabId, frameStack, action, state) => executeScript(`window.triggerBack(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true }));

var forward = (tabId, frameStack, action, state) => executeScript(`window.triggerForward(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true }));

var refresh = (tabId, frameStack, action, state) => executeScript(`window.triggerRefresh(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true }));

var clearCookies = (tabId, frameStack, action, state) => clearCookiesByUrl(action.value);

var clearCaches = (tabId, frameStack, action, state) =>
  clearCookiesByUrl(action.cookieDomain)
    .then(() => executeScript(`window.clearCaches(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var dynamicVar = (tabId, frameStack, action, state, subroutine, derivedVariables, dynamicVars) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.getInnerHtml(${JSON.stringify(action)})`, tabId, frameStack, state)
      .then((result) => {
        dynamicVars[action.value] = result.value;
        return {success: true}
      }));

var click = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerClick(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var doubleClick = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerDoubleClick(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var focus = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerFocus(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var blur = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerBlur(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var changeInput = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerChangeInput(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var setDialogs = (tabId, frameStack, action, state) =>
  waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) =>  executeScript(`window.setDialogs(${JSON.stringify(action)})`, tabId, frameStack, state))
    .then(() => ({ success: true }));

var pauseTime = (tabId, frameStack, action, state) => new Promise((resolve, reject) => setTimeout(() => resolve({success: true}), action.value));

var submit = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerSubmit(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var executeCustomScript = (tabId, frameStack, action, state) =>
  waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) => executeScript(`window.executeScript(${JSON.stringify(action)})`, tabId, frameStack, state))
    .then((result) => {
      if (!result || !result.success) return { success: false, error: result.message };
      else return { success: true };
    });

var scrollWindow = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerScrollWindow(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var scrollElement = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerScrollElement(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var scrollWindowtoEl = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    executeScript(`window.triggerWindowToElement(${JSON.stringify(action)})`, tabId, frameStack, state).then(() => ({ success: true })));

var textAssert = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) => executeScript(`window.assertText(${JSON.stringify(action)})`, tabId, frameStack, state))
      .then((result) => {
        if (!result || !result.success) return { success: false, error: `Expected text to be "${action.value}" but was "${result.value}"` };
        else return { success: true };
      }));

var textRegexAssert = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) => executeScript(`window.assertTextRegex(${JSON.stringify(action)})`, tabId, frameStack, state))
      .then((result) => {
        if (!result || !result.success) return { success: false, error: `Expected text to match regex "${action.value}" but was "${result.value}"` };
        else return { success: true };
      }));

var valueAssert = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) => executeScript(`window.assertValue(${JSON.stringify(action)})`, tabId, frameStack, state))
      .then((result) => {
        if (!result || !result.success) return { success: false, error: `Expected value to be "${action.value}" but was "${result.value}"` };
        else return { success: true };
      }));

var styleAssert = (tabId, frameStack, action, state) =>
  waitForElementPresent(tabId, frameStack, action, state).then((el) => !el ? { success: false, error: elementNotFoundMessage(action) } :
    waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) => executeScript(`window.assertStyle(${JSON.stringify(action)})`, tabId, frameStack, state))
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


var evalAmbiguous = (tabId, frameStack, action, state, subroutine, derivedVariables, dynamicVars) =>
  waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) =>
    executeScript(`window.evalValue(${JSON.stringify(action.value)}, ${JSON.stringify(derivedVariables)}, ${JSON.stringify(dynamicVars)})`, tabId, frameStack, state))
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

var insertCsvRow = (tabId, frameStack, action, state, subroutine, derivedVariables, dataVars) => new Promise((resolve, reject) => {

  waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) =>
    executeScript(`window.getCsvValues(${JSON.stringify(action)})`, tabId, frameStack, state))
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

var screenshot = (tabId, frameStack, action, state) =>
  waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) => executeScript(callExecuteFunction("hideSnapUI", JSON.stringify(action)), tabId, frameStack, state))
    .then(() => new Promise((resolve, reject) => {

      chrome.tabs.captureVisibleTab(state.currentWindowId, { format: 'jpeg', quality: 70 }, (dataURI, error) => {

        var uuid = uuidv4();
        action.screenshot = uuid;

        saveScreenshot(dataURI, uuid).then(() => {
          return resolve({ success: true});
        });
      })

  })).then(() => executeScript("window.showSnapUI()", tabId, frameStack, state));

var request = (tabId, frameStack, action, state) => new Promise((resolve, reject) => {

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

  // waitOnExecuteScriptSuccess(tabId, frameStack, action, state, (tabId, frameStack, action, state) =>
  //   executeScript(`window.sendRequest(${JSON.stringify(action)})`, tabId, frameStack, state))
  //   .then((result) => {
  //     return resolve({success: true})
  //     // return {success: true};
  //   });
});