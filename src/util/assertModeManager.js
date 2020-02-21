import Message from '../util/Message.js'
import * as Actions from '../models/Action'
import {getSelectorInfo} from './selectorbuilder1'
import {isDescendant, getTextNode} from './util'

var cachedIsInAssertMode;

var onElementClick = function(e) {

  if(isDescendant(document.querySelector("#snpt-tab"), e.target)) return;

  var textNode = getTextNode(e.target);
  var selectorInfo = getSelectorInfo(e.target);
  var suggestions = [], warnings = [];

  if (selectorInfo.suggestion && selectorInfo.strength < .5) warnings.push(selectorInfo.suggestion);

  if (textNode && textNode.length > 0) {
    Message.toAll("addAction", new Actions.TextAssertAction(selectorInfo.selector, textNode, warnings, suggestions));
  } else if (e.target.type === "checkbox" || e.target.type === "radio") {
    Message.toAll("addAction", new Actions.ValueAssertAction(selectorInfo.selector, e.target.checked ? "true" : "false", warnings, suggestions));
  } else if (e.target.value) {
    Message.toAll("addAction", new Actions.ValueAssertAction(selectorInfo.selector, e.target.value, warnings, suggestions));
  } else {
    Message.toAll("addAction", new Actions.ElPresentAssertAction(selectorInfo.selector, warnings, suggestions));
  }
};

export function assertModeManager(isInAssertMode) {

  // if no change to assert mode, get out!
  if (isInAssertMode === cachedIsInAssertMode) {
    return;
  } else {
    cachedIsInAssertMode = isInAssertMode;
  }

  if (isInAssertMode) {
    document.body.classList.add("snpa");
    document.documentElement.addEventListener('mousedown', onElementClick, true);
  } else {
    document.body.classList.remove("snpa");
    document.documentElement.removeEventListener('mousedown', onElementClick, true);
  }

}