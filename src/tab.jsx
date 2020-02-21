import ReactDOM from 'react-dom'
import React from 'react'
import domready from 'domready'
import ModeContainer from './container/ModeContainer.jsx';
import initActionRecorder from './util/actionrecorder.js'
import Message from './util/Message';
import {assertModeManager} from './util/assertModeManager';
import {recordModeManager} from './util/recordModeManager';
import {selectionModeManager} from './util/selectionModeManager';
import './util/playbackHooks';
import {elHoverIndicatorManager} from './util/generalManagers';
require('./scss/tab.scss');

var tabId;

// check if this is the current tab on page load.
chrome.runtime.sendMessage('getTabInfo', function(result) {
  tabId = result.tabId;
  if (result.tabId === result.currentTabId) {
    Message.to(Message.SESSION, "getState", {}, function(state) {
      domready(function () {
        if (state.currentTabId === tabId && !window.isInitialized) {
          initState(state);
        }
      });
    });
  }
});

// keep checking for this to be the current tab.
Message.onMessageFor(Message.PANEL, (message) => {
  if (message.payload.currentTabId === tabId && !window.isInitialized) {
    initState(message.payload);
  } else if (message.payload.currentTabId === tabId) {
    unsuspend();
  } else if (!window.isSuspended) {
    suspend();
  }
});

window.snaptest_loaded_ping = function() {
  return {success: true}
};

function suspend() {
  var tabAppDiv = document.querySelector("#snpt-tab");

  if (tabAppDiv) {
    tabAppDiv.style.display = "none"
  }

  window.isSuspended = true;
}

function unsuspend() {
  var tabAppDiv = document.querySelector("#snpt-tab");

  if (tabAppDiv) {
    tabAppDiv.style.display = "block"
  }

  window.isSuspended = false;
}

function initState(state) {

  window.isInitialized = true;
  window.isRecording = state.isRecording;
  window.isAssertMode = state.isAssertMode;
  window.isSelecting = state.isSelecting;
  window.isPlayingBack = state.isPlayingBack;
  window.userSettings = state.userSettings;
  assertModeManager(window.isAssertMode, Message);
  recordModeManager(window.isRecording);
  selectionModeManager(window.isSelecting, state.selectingForAction);
  elHoverIndicatorManager(state.actionElIndicatorSelector);

  Message.onMessageFor(Message.PANEL, (message) => {

    if (!window.isSuspended) {
      switch (message.action) {
        case "stateChange":
          window.isRecording = message.payload.isRecording;
          window.isSelecting = message.payload.isSelecting;
          window.isAssertMode = message.payload.isAssertMode;
          window.userSettings = message.payload.userSettings;
          assertModeManager(message.payload.isAssertMode);
          recordModeManager(message.payload.isRecording);
          selectionModeManager(message.payload.isSelecting, message.payload.selectingForAction);
          elHoverIndicatorManager(message.payload.actionElIndicatorSelector);
          break;
      }
    }
  });

  initActionRecorder();

  var uiBodyEl = document.createElement("div");
  var uiContainerEl = document.createElement("div");

  document.querySelector("body").appendChild(uiBodyEl);
  uiBodyEl.appendChild(uiContainerEl);

  uiBodyEl.setAttribute("id", "snpt-tab");
  uiContainerEl.setAttribute("id", "snpt-container");

  ReactDOM.render(<ModeContainer initialState={state} />, uiContainerEl);

}

// inject some js into the page itself to handle the assertion blocking.
var s = document.createElement('script');
s.src = chrome.extension.getURL('injected.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

