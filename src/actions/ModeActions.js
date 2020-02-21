import {resetModes} from '../util/ModeManager'
import {addRecordedAction} from '../util/ActionManager';
import {autoSave} from '../util/statePersistance'
import * as Actions from '../models/Action';
import {upsertDraft} from '../session'

export const startRecording = (params, state) => {
  return new Promise((resolve, reject) => {

    resetModes(state);

    return ensureActiveTab(state).then((tab) => {

      state.isRecording = true;
      state.isAssertMode = false;

      if (state.activeTest.actions.length === 0 && state.activeTest.type === "test") {
        upsertDraft(state);
        var newAction = new Actions.FullPageloadAction(tab.url, tab.width, tab.height);
        addRecordedAction(state, state.activeTest, newAction);
        if (state.userSettings.autodescribe && state.commentedActions.indexOf(message.payload.id) === -1) state.commentedActions.push(newAction.id);
        autoSave(state.activeTest, state);
      }

      resolve();

    })
    .catch((e) => {
      state.playbackError = e;
      reject();
    });

  });
};

export const stopRecording = (params, state) => {
  return new Promise((resolve, reject) => {
    state.isRecording = false;
    resolve();
  });
};

export const startAsserting = (params, state) => {
  return new Promise((resolve, reject) => {
    ensureActiveTab(state).then(() => {
      state.isAssertMode = true;
      state.isRecording = false;
      resolve();
    })
    .catch((e) => {
      state.playbackError = e;
      reject();
    });
  });
};

export const stopAsserting = (params, state) => {
  return new Promise((resolve, reject) => {
    state.isAssertMode = false;
    state.isRecording = false;
    resolve();
  });
};

export const setCurrentTab = (params, state) => {
  return new Promise((resolve, reject) => {
    const { currentTabId, currentWindowId } = params;
    if (typeof currentTabId !== "undefined") state.currentTabId = currentTabId;
    if (typeof currentWindowId !== "undefined") state.currentWindowId = currentWindowId;
    resolve();
  });
};

export function ensureActiveTab(state) {
  return new Promise((resolve, reject) => {
    chrome.tabs.getSelected(state.currentWindowId, (tab) => {
      chrome.tabs.executeScript(tab.id, {code: "window.snaptest_loaded_ping()"}, (result, error) => {
        if (typeof result === "undefined" || error) return reject("Can't record at this url.");
        else if (!result[0]) {
          state.currentTabId = tab.id;
          chrome.tabs.executeScript(tab.id, {code: "window.location.reload();"}, (result, error) => {
            return resolve(tab);
          })
        }
        else {
          state.currentTabId = tab.id;
          return resolve(tab);
        }
      });
    });
  })
}

export function setCurrentAsActiveTab(state) {
  return new Promise((resolve, reject) => {
    if (!state.currentWindowId) {
      return reject(`No testing tab selected.  Click "Start Testing" in the extension popup to play this test.`)
    }
    chrome.tabs.getSelected(state.currentWindowId, (tab) => {
      if (tab.windowId !== state.appWindowId) {
        state.currentTabId = tab.id;
        state.currentWindowId = tab.windowId;
        resolve(tab);
      } else {
        return reject(`No testing tab selected.  Click "Start Testing" in the extension popup to play this test.`)
      }
    });
  })
}
