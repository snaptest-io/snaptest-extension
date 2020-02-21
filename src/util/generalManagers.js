import Message from './Message';
import {FullPageloadAction } from '../models/Action'
import {getElement} from './util'

var recentlyHovered = [];

export function elHoverIndicatorManager(highlightAction) {

  if (highlightAction) {
    var highlightedEl = getElement(highlightAction);
    if (highlightedEl) {
      recentlyHovered.push(highlightedEl);
      highlightedEl.style.border = "2px solid #ff3535";
      highlightedEl.style.visibility = "visible";
      highlightedEl.style.background = "rgba(255, 0, 0, .05)";
    }
  } else {
    for (var i = 0; i < recentlyHovered.length; i++) {
      recentlyHovered[i].style.border = "";
      recentlyHovered[i].style.visibility = "";
      recentlyHovered[i].style.background = "";
    }
    recentlyHovered = [];
  }
}

window.evalActionValues = function (action, variables, dynamicVars) {

  var dynamic = dynamicVars;

  try {
    if (typeof action.value === "string") action.value = evalThis(action.value, variables, dynamic);
    if (typeof action.selector === "string") action.selector = evalThis(action.selector, variables, dynamic);
    if (typeof action.cookieDomain === "string") action.cookieDomain = evalThis(action.cookieDomain, variables, dynamic);
    if (typeof action.url === "string") action.url = evalThis(action.url, variables, dynamic);

    if (action.type === "COMPONENT") {
      action.variables.forEach((variable) => {
        if (typeof variable.value === "string") variable.value = evalThis(variable.value, variables, dynamic);
      })
    }

    if (action.type === "CSV_INSERT") {
      action.csvName = evalThis(action.csvName, variables, dynamic);
      action.columns.forEach((column) => {
        column.columnName = evalThis(column.columnName, variables, dynamic);
        column.selector = evalThis(column.selector, variables, dynamic);
      })
    }

    return {
      action,
      dynamicVars: dynamic
    };

  } catch(e) {
    return {
      error: e.message
    };
  }

};

window.evalValue = function (value, variables, dynamicVars) {

  try {
    var result = evalThis("$(" + value + ")", variables, dynamicVars);

    return {
      result,
      success: true,
      dynamicVars
    }

  } catch(e) {
    return {
      result: e.message,
      success: false,
      dynamicVars
    }
  }

};

function evalThis(str, vars, exports) {

  var copyOfVars = {};

  for (var i in vars) {
    copyOfVars[i] = vars[i];
  }

  var regex = /\$\(/gi, result, indices = [];
  while ( (result = regex.exec(str)) ) {
    indices.push(result.index);
  }

  var evalData = indices.map((index) => ({
    start: index,
    end: null,
    value: null
  }));

  evalData = evalData.map((evalD) => {
    var opened = 0;
    var closed = 0;
    var currentIdx = evalD.start + 2;
    var currentChar = str.charAt(currentIdx);
    var result = "";

    while(currentChar) {
      if (currentChar === "(") {
        opened++;
      }
      else if (currentChar === ")") {
        closed++;
        if (closed > opened) break;
      }

      result+=currentChar;
      currentIdx++;
      currentChar = str.charAt(currentIdx);
    }

    return {...evalD, result: eval(result), end: currentIdx, length: currentIdx - evalD.start}

  })

  var newString = str;

  evalData.forEach((evalD) => {
    var nextSubIdx = newString.indexOf("$(");
    newString = newString.split("");
    newString.splice(nextSubIdx, evalD.length + 1, evalD.result + "");
    newString = newString.join("");
  });

  for (var i in vars) {
    if (vars[i] !== copyOfVars[i]) exports[i] = vars[i];
  }

  return newString;

}