import {isDescendant} from './util.js'
import {recordAction} from '../container/actions'
import { getTextNode } from './util';
import { getSelectorInfo } from './selectorbuilder1.js';

import {
  KeydownAction,
  MousedownAction,
  InputAction,
  SubmitAction } from '../models/Action';

const LOG = false;
var timeOfLastAction = Date.now();

export default function(state) {

  window.document.documentElement.addEventListener('keydown', function(e){

    if (!window.isRecording || window.isAssertMode) return;
    if (!validateEvent(e)) return;

    var selectorInfo = getSelectorInfo(e.target, window.userSettings.selectorPriority.selectorPriority);

    var keydownAction = new KeydownAction(selectorInfo.selector, e.key, e.keyCode, e.target.value + e.key, selectorInfo.warnings, selectorInfo.suggestions);
    if (LOG) console.log(keydownAction);

    recordAction(keydownAction);

  }, true);

  window.document.documentElement.addEventListener('submit', function(e){

    if (!window.isRecording || window.isAssertMode) return;
    if (!validateEvent(e)) return;

    // if a mousedown happened right before this, it probably means it submitted the form. so we need to skip
    if (Date.now() - timeOfLastAction < 100) return;

    var selectorInfo = getSelectorInfo(e.target, window.userSettings.selectorPriority);

    var submitAction = new SubmitAction(selectorInfo.selector, selectorInfo.warnings, selectorInfo.suggestions);
    if (LOG) console.log(submitAction);

    recordAction(submitAction);

  }, true);

  window.document.documentElement.addEventListener('mousedown', function(e){

    if (!window.isRecording || window.isAssertMode) return;
    if (!validateEvent(e)) return;

    var selectorInfo = getSelectorInfo(e.target, window.userSettings.selectorPriority);
    var textContent = getTextNode(e.target);

    var mousedownAction = new MousedownAction(selectorInfo.selector, textContent, e.clientX, e.clientY, selectorInfo.warnings, selectorInfo.suggestions);
    if (LOG) console.log(mousedownAction);

    recordAction(mousedownAction);

    timeOfLastAction = Date.now();

  }, true);

  window.document.documentElement.addEventListener('input', function(e){

    if (!window.isRecording || window.isAssertMode) return;
    if (!validateEvent(e)) return;

    var selectorInfo = getSelectorInfo(e.target, window.userSettings.selectorPriority);
    var value = "";

    if (selectorInfo.suggestion && selectorInfo.strength < .5) warnings.push(selectorInfo.suggestion);

    if (e.target.isContentEditable) {
      value = e.target.innerHTML;
    } else {
      value = e.target.checked ? e.target.checked : e.target.value;
    }

    var inputAction = new InputAction(
        selectorInfo.selector,
        e.target.type,
        value,
        e.target.isContentEditable,
        selectorInfo.warnings,
        selectorInfo.suggestions
    );

    if (LOG) console.log(inputAction);

    recordAction(inputAction);

  }, true);

};

function validateEvent(e) {
  return !isDescendant(document.querySelector(".control-panel"), e.target);
}