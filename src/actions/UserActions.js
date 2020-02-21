import * as API from '../api'
import {getTestData} from './TestActions'
import {cacheLocalMode} from './LocalActions'
import {getSettings, parseIncomingSettings} from "./SettingsActions";
import Message from '../util/Message'
import {getRuns} from "./RunActions";
import Route from "../models/Route";
import {getTags} from "./TagActions";
import {initialResultFilters} from "./ResultFilterActions";
import {switchDraftContexts} from "../managers/DraftManager";

export const login = (params, state) => {
  
  const { email, password } = params;

  return API.login(email, password, {checkpremium: 1, includesettings: 1})
    .then((result) => {
      state.user = result.user;
      state.premium = result.user.premium.enabled;
      state.localmode = false;
      var settings = parseIncomingSettings(result.user.settings);
      if (settings.openFolders) state.openFolders = settings.openFolders;
      chrome.storage.sync.set({'user': state.user});
      return getOrgs({includeaccounts: true}, state);
    })
    .then(() => getRuns({}, state))
    .then(() => getTestData({}, state));

};

export const reportError = (params, state) => {

  const { message, category, severity = "LOW" } = params;

  return API.reportError(message, category, severity, state.localmode, state.contextType, state.contextId)
    .then(() => getUser(params, state));
}

export const acceptTerms = (params, state) =>
  API.acceptTerms(state.user.apikey)
    .then(() => getUser(params, state));

export const sudoLogin = (params, state) => {

  const { email } = params;

  return API.sudoLogin(email, {checkpremium: 1})
    .then((result) => {
      state.user = result.user;
      state.premium = result.user.premium.enabled;
      state.sudoer = true;
      chrome.storage.sync.set({'user': state.user});
      return getOrgs({}, state);
    }).then(() => getTestData({}, state))

};

export const register = (params, state) => {

  const { email, password, password2, agreedtoterms } = params;

  return API.register(email, password, password2, agreedtoterms)
    .then((result) => {
      state.user = result.user;
      state.localmode = false;
      chrome.storage.sync.set({'user': state.user});
    }).then(() => getTestData({}, state))

};

export const switchToCloud = (params = {}, state) => {

  if (state.localmode && params.skipLocalCaching) cacheLocalMode(state);

  switchDraftContexts("user", null, state);

  state.contextType = "user";
  state.contextId = "me";
  state.localmode = false;
  state.autoSaveStatus = "idle";
  state.projects = [];
  state.selectedOrg = null;
  state.selectedProject = null;
  state.isSwitchingContext = true;
  state.activeTest = null;
  state.activeResult = null;
  state.resultFilters = initialResultFilters();
  state.projectReadAccessDenied = false;
  state.tagTestFilters = [];
  state.testFilterOperator = "AND";

  var currentRoute = state.viewStack[state.viewStack.length - 1];

  if (currentRoute.name === "testbuilder" || currentRoute.name === "componentbuilder" || currentRoute.name === "codeviewer") {
    state.viewStack = [new Route("dashboard")];
  } else {
    if (currentRoute.name === "auth") state.viewStack = [new Route("dashboard")];
    else state.viewStack = [state.viewStack[state.viewStack.length - 1]];
  }

  Message.toAll( "stateChange", {...state });

  return getTestData({}, state)
    .then(() => getSettings({}, state))
    .then(() => getOrgs({includeprojects: true}, state))
    .then(() => getRuns({}, state))
    .then(() => getTags({}, state))
    .then(() => {
      state.isSwitchingContext = false;
      Message.toAll( "stateChange", {...state })
    })
    .catch((e) => {
      state.isSwitchingContext = false;
      if (e.status === 401) state.projectReadAccessDenied = true;
      Message.toAll( "stateChange", {...state })
    })

};


export const getUser = (params, state) => {
  return API.getMyUser(state.user.apikey, {includesetting: 1, checkpremium: 1})
    .then((result) => {
      state.user = result.user;
      state.premium = result.user.premium.enabled;
    });
};

export const getOrgs = (params, state) => {

  if (state.localmode) return;

  var includeaccounts = params.includeaccounts;

  return API.getOrgs(state.user.apikey)
    .then((result) => {
      if (includeaccounts) {

        var orgs = result.orgs.items;
        var promises = orgs.map((org) => API.getProjects(state.user.apikey, org.id));

        return Promise.all(promises).then((results) => {

          var orgAccounts = [];

          orgs.forEach((org, orgIdx) => {

            orgAccounts.push({name: org.name, id: org.id, type: "org"});

            var projects = results[orgIdx].projects.items;

            projects.filter((project) => !project.archived).forEach((project) => {
              orgAccounts.push({
                name: org.name + " -> " + project.name,
                id: project.id, type: "project",
                permissions: project.permissions
              });
            })

          });

          state.orgs = orgs;
          state.orgAccounts = orgAccounts;

        });
      } else {
        state.orgs = result.orgs.items;
        return new Promise((resolve) => resolve());
      }

    });
};