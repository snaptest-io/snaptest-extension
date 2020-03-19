import {getTextNode, getValue, getStyle, getElement} from './util'
import _ from 'lodash'
import {SEL_XPATH, SEL_CSS, SEL_ID, SEL_ATTR, SEL_NAME, SEL_TEXT} from '../models/Action';

window.checkElement = function(action) {
  var element = getElement(action);
  if (element) return {success: true};
  else return {success: false};
};

window.checkElementVisible = function(action) {

  var elem = getElement(action);

  if (elem) {

    function isVisible(elem) {

      var style = getComputedStyle(elem);

      if (action.checkDisplay && style.display === 'none') return false;

      if (action.checkVisibility && style.visibility !== 'visible') return false;

      if (action.checkOpacity && style.opacity < 0.1) return false;

      if (action.checkDimensions) {
        if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
          elem.getBoundingClientRect().width === 0) {
          return false;
        }
      }

      if (action.checkCenterPoint) {
        const elemCenter = {
          x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
          y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
        };
        if (elemCenter.x < 0) return false;
        if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
        if (elemCenter.y < 0) return false;
        if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;

        let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);

        do {
          if (pointContainer === elem) return true;
        } while (pointContainer = pointContainer.parentNode);
        return false;
      }

      return true;

    }

    return {
      success: isVisible(elem)
    }

  }

  return {success: false};

};

window.pathAssert = (action) => {

  var value = window.location.pathname;
  var success = false;

  if (action.regex) {
    var assertRegEx = new RegExp(action.value, "gi");
    if (assertRegEx.test(value)) success = true;
  } else {
    if (value === action.value) {
      success = true;
    }
  }

  return { success, value }

};

window.triggerMouseEvent = function (node, eventType) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

window.triggerKeyEvent = function (node, eventType) {
  var keydownEvent = document.createEvent( 'KeyboardEvent' );
  keydownEvent.initEvent( eventType, true, false, null, 0, false, 0, false, 66, 0 );
  node.dispatchEvent( keydownEvent );
}

window.triggerClick = function(action) {

  var el = getElement(action);

  if (!el) return false;

  triggerMouseEvent(el, "mouseover");
  triggerMouseEvent(el, "mousedown");
  triggerMouseEvent(el, "mouseup");
  triggerMouseEvent(el, "click");

  return { success: true }

};

window.triggerDoubleClick = function(action) {
  var el = getElement(action);
  triggerMouseEvent(el, "dblclick");
  return { success: true }
};

window.triggerBack = function() {
  window.history.back();
  return { success: true }
};

window.triggerForward = function() {
  window.history.forward();
  return { success: true }
};

window.triggerRefresh = function() {
  window.location.reload();
  return { success: true }
};

window.clearCaches = function(action) {

  if (action.localstorage) {
    localStorage.clear();
  }

  if (action.sessionstorage) {
    sessionStorage.clear();
  }

  if (action.indexdb && action.indexdbDatabases) {
    var databases = action.indexdbDatabases.split(",");

    databases.forEach((database) => {
      var req = indexedDB.deleteDatabase(database.trim());
      req.onsuccess = function () { console.log("deleted database successfully"); };
      req.onerror = function () { console.log("couldn't delete database"); };
      req.onblocked = function () { console.log("couldn't delete database due to the operation being blocked"); };
      req.onupgradeneeded = function () { console.log("upgrade needed");};
    })
  }

  return { success: true }

};

window.getInnerHtml = function(action) {
  var element = getElement(action);
  var value = (getValue(element) ||  getTextNode(element) || "");
  return { success: true, value }
};

window.getOffsets = function() {
  return {
    x: window.scrollX,
    y: window.scrollY
  }
};

window.getPageInfo = function() {

  const body = document.body;

  const widths = [
    document.documentElement.clientWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
    body ? body.scrollWidth : 0,
    body ? body.offsetWidth : 0
  ];

  const heights = [
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    body ? body.scrollHeight : 0,
    body ? body.offsetHeight : 0
  ];

  const data = {
    pageWidth:    Math.max(...widths),
    pageHeight:   Math.max(...heights),
    windowWidth:  window.innerWidth,
    windowHeight: window.innerHeight,
    hasBody:      !!body,
    originalX:    window.scrollX,
    originalY:    window.scrollY,
    originalOverflowStyle: document.documentElement.style.overflow,
    originalBodyOverflowYStyle: body && body.style.overflowY,
    devicePixelRatio: window.devicePixelRatio
  };

  return { success: true, data: data };

};

window.triggerFocus = function(action) {
  var el = getElement(action);
  var event = new FocusEvent('focus');
  el.dispatchEvent(event);
  return { success: true }
};

window.triggerBlur = function(action) {
  var el = getElement(action);
  var event = new FocusEvent('blur');
  el.dispatchEvent(event);
  return { success: true }
};

window.triggerChangeInput = function (action) {
  var el = getElement(action);

  triggerKeyEvent(el, "keydown");
  el.focus();

  if (action.isContentEditable) {
    el.innerHTML = action.value;
  } else {
    el.value = action.value;
  }

  el.dispatchEvent(new Event('change', {bubbles: true}));
  el.dispatchEvent(new Event('input', {bubbles: true}));
  triggerKeyEvent(el, "keyup");
  triggerKeyEvent(el, "keypress");
  return { success: true }
};

window.setDialogs = function (action) {
  var scriptContent = `
  ${action.alert ? "window.alert = function() {};" : ""}
  ${_.isBoolean(action.confirm) ? "window.confirm = function() { return " + (action.confirm ? "true" : false) + ";};" : ""}
  ${action.prompt ? "window.prompt = function() { return \"" + action.promptResponse + "\";};" : ""}
`;

  var script = document.constructor.prototype.createElement.call(document, 'script');
  script.setAttribute('type', 'text/javascript');
  script.text = scriptContent;
  document.documentElement.appendChild(script);
  return { success: true }
};

window.triggerSubmit = function(action) {
  var el = getElement(action);
  var event = new Event('submit');
  el.dispatchEvent(event);
  return { success: true }
};

window.triggerScrollWindow = function(action) {
  window.scrollTo(action.x, action.y);
  return { success: true }
};

window.triggerScrollElement = function(action) {
  var el = getElement(action);
  el.scrollLeft = action.x;
  el.scrollTop = action.y;
  return { success: true }
};

window.triggerWindowToElement = function(action) {
  var el = getElement(action);
  var elsScrollY = el.getBoundingClientRect().top + window.scrollY - el.offsetHeight;
  window.scrollTo(0,  elsScrollY);
  return { success: true }
};

window.assertText = function(action) {

  var expectedValue = action.value;
  var actualValue = getTextNode(getElement(action));
  var success = false;

  if (action.regex) {
    var assertRegEx = new RegExp(action.value, "gi");
    if (assertRegEx.test(actualValue)) success = true;
  } else {
    if (actualValue === expectedValue ) success = true;
  }

  return { success, value: actualValue };
};

window.assertTextRegex = function(action) {

  var expectedValue = action.value;
  var actualValue = getTextNode(getElement(action));
  var assertRegEx = new RegExp(regexToMatch);

  if (action.regex) {
    var assertRegEx = new RegExp(action.value, "gi");
    if (assertRegEx.test(actualValue)) success = true;
  } else {
    if (actualValue === expectedValue ) success = true;
  }

  return { success, value: actualValue };
};

window.assertValue = function(action) {

  var expectedValue = action.value;
  var actualValue = getValue(getElement(action));
  var success = false;

  if (action.regex) {
    var assertRegEx = new RegExp(action.value, "gi");
    if (assertRegEx.test(actualValue)) success = true;
  } else {
    if (actualValue === expectedValue ) success = true;
  }

  return { success, value: actualValue };

};

window.assertStyle = function(action) {

  var style = action.style;
  var expectedValue = action.value;
  var actualValue = getStyle(getElement(action), style);
  var success = false;

  if (action.regex) {
    var assertRegEx = new RegExp(action.value, "gi");
    if (assertRegEx.test(actualValue)) success = true;
  } else {
    if (actualValue === expectedValue ) success = true;
  }

  return { success, value: actualValue };

};

window.executeScript = function(action) {
  try {
    var result = eval(`(function() { ${action.script} })();`);
    if (_.isBoolean(result) && !result) {
      return {success: false, message: "Script failed because it returned false.", value: result};
    } else {
      return {success: true};
    }
  } catch (e) {
    return {success: false, message: e.message};
  }
};

window.getCsvValues = function(action) {

  var results = [];

  action.columns.forEach((column) => {
    var element = getElement({selectorType: SEL_CSS, selector: column.selector});
    if (element) {
      var select = column.select || "innerHTML";
      results.push(element[select]);
    }
    else results.push("")
  });

  return {
    success: true,
    results
  };

};

window.sendRequest = function(action) {
  return {
    success: true
  };
};

window.hideSnapUI = function() {
  document.querySelector("#snpt-container").style.display = "none";
  return {
    success: true
  };
};

window.showSnapUI = function() {
  document.querySelector("#snpt-container").style.display = "block";
  return {
    success: true
  };
};