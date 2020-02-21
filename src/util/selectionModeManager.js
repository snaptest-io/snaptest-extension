import Message from '../util/Message.js'
import {getSelectorInfo} from './selectorbuilder1'
import {isDescendant, getTextNode} from './util'
import {SEL_ID, SEL_NAME, SEL_TEXT} from "../models/Action"

var cachedIsInSelectionMode;
var selectingForAction;

var onClick = function(e) {
  if(isDescendant(document.querySelector("#snpt-sandboxed"), e.target)) return;
  var selectorInfo = getSelectorInfo(e.target);
  // pause for 32 ms so we can stopProp/preventDef in the injected.js properly.
  setTimeout(() => {

    var selectorType = selectingForAction.selectorType;

    if (selectorType === SEL_NAME) {
      if (e.target.name) {
        Message.to(Message.SESSION, "setSelection", e.target.name);
      }
    } else if (selectorType === SEL_ID) {
      if (e.target.id) {
        Message.to(Message.SESSION, "setSelection", e.target.id);
      }
    } else if (selectorType === SEL_TEXT) {
      var text = getTextNode(e.target);
      if (text !== "") {
        Message.to(Message.SESSION, "setSelection", text);
      }
    } else {
      var selectorInfo = getSelectorInfo(e.target);
      Message.to(Message.SESSION, "setSelection", selectorInfo.selector);
    }

  }, 32)
};

var onMouseOver = function(e) {

  if(isDescendant(document.querySelector("#snpt-sandboxed"), e.target)) return;

  var selectorType = selectingForAction.selectorType;

  if (selectorType === SEL_NAME) {
    if (e.target.name) {
      Message.to(Message.SESSION, "setSelectionCandidate", e.target.name);
    } else {
      Message.to(Message.SESSION, "setSelectionCandidate", null);
    }
  } else if (selectorType === SEL_ID) {
    if (e.target.id) {
      Message.to(Message.SESSION, "setSelectionCandidate", e.target.id);
    } else {
      Message.to(Message.SESSION, "setSelectionCandidate", null);
    }
  } else if (selectorType === SEL_TEXT) {
    var text = getTextNode(e.target);
    if (text !== "") {
      Message.to(Message.SESSION, "setSelectionCandidate", text);
    } else {
      Message.to(Message.SESSION, "setSelectionCandidate", null);
    }
  } else {
    var selectorInfo = getSelectorInfo(e.target);
    Message.to(Message.SESSION, "setSelectionCandidate", selectorInfo.selector);
  }

};

export function selectionModeManager(isInSelectionMode, _selectingForAction) {

  // if no change to assert mode, get out!
  if (isInSelectionMode === cachedIsInSelectionMode) {
    return;
  } else {
    cachedIsInSelectionMode = isInSelectionMode;
  }

  selectingForAction = _selectingForAction;

  if (isInSelectionMode) {
    document.body.classList.add("snpa");
    document.documentElement.addEventListener('mousedown', onClick, true);
    document.documentElement.addEventListener('mouseover', onMouseOver, true);
  } else {
    document.body.classList.remove("snpa");
    document.documentElement.removeEventListener('mousedown', onClick, true);
    document.documentElement.removeEventListener('mouseover', onMouseOver, true);
  }

}