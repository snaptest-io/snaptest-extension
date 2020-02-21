import _ from 'lodash'
import * as API from '../api'

function prepValue(value) {
  if (_.isBoolean(value)) value = value ? 1 : 0;
  if (_.isObject(value) || _.isArray(value)) value = JSON.stringify(value);
  return value;
}

export const setSetting = (params, state) => {

  var { key, value } = params;
  const { selectedOrg, selectedProject } = state;

  state.userSettings[key] = value;

  if (state.localmode) return;

  var contextType = "user";
  var contextId = "me";

  if (selectedProject) {
    contextType = "project";
    contextId = selectedProject.id;
  } else if (selectedOrg) {
    contextType = "org";
    contextId = selectedOrg.id;
  }

  return API.updateSetting(state.user.apikey, contextType, contextId, key, prepValue(value))

};

export const setUserSetting = (params, state) => {

  if (state.localmode) return;

  var { key, value } = params;
  return API.updateSetting(state.user.apikey, "user", "me", key, prepValue(value));
};

export const getSettings = (params, state) => {

  if (state.localmode) return;

  const { selectedOrg, selectedProject } = state;

  var contextType = "user";
  var contextId = "me";

  if (selectedProject) {
    contextType = "project";
    contextId = selectedProject.id;
  } else if (selectedOrg) {
    contextType = "org";
    contextId = selectedOrg.id;
  }

  return API.getSettings(state.user.apikey, contextType, contextId)
    .then((result) => {

      var newSettings = getDefaultSettings();

      result.settings.forEach((setting) => {
        if (typeof newSettings[setting.key] !== "undefined") {

          var newValue;

          try {
            newValue = JSON.parse(setting.value);
            if (newValue === 1) newValue = true;
            if (newValue === 0) newValue = false;
            newSettings[setting.key] = newValue;
          } catch(e) {}

        }
      });

      state.userSettings = newSettings;

    });
};

export function parseIncomingSettings(rawSettings) {
  var parsedSettings = {};

  rawSettings.forEach((setting) => {

      var newValue;

      try {
        newValue = JSON.parse(setting.value);
        if (newValue === 1) newValue = true;
        if (newValue === 0) newValue = false;
        parsedSettings[setting.key] = newValue;
      } catch(e) {}

  });

  return parsedSettings;
}

export function getDefaultSettings() {
  return {
    drafts: false,
    warnings: false,
    autodescribe: false,
    actionNumbers: false,
    globalTimeout: 5000,
    descriptions: [],
    selectorPriority: [
      {type: "attr", name: "test-id", enabled: true, ancestor: false},
      {type: "id", enabled: true},
      {type: "name", enabled: true},
      {type: "type", enabled: true},
      {type: "ancestor", enabled: true},
      {type: "class", enabled: true}
    ]
  }
}