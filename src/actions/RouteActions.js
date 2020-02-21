import {onPageChange} from '../util/ModeManager'

export const pushRoute = (params, state) => {
  return new Promise((resolve, reject) => {
    onPageChange(state);

    var currentRoute = state.viewStack[state.viewStack.length - 1];
    var nextRoute = params.route;

    if (!currentRoute || (currentRoute && currentRoute.name !== nextRoute.name)) {
      state.viewStack.push(nextRoute);
    }

    if (nextRoute.name === "testbuilder" || nextRoute.name === "componentbuilder") {
      state.commentedActions = state.activeTest.actions.filter((action) => action.description).map((action) => action.id);
    }

    if (nextRoute.name === "multiplayback") {
      state.multiPlaybackQueue = nextRoute.data.testsToRun;
      state.multiPlaybackFolderString = nextRoute.data.folderString;
      state.activeTest = _.find(state.tests, {id: state.multiPlaybackQueue[0]});
    }

    resolve();

  });
};

export const backRoute = (params, state) => {
  return new Promise((resolve, reject) => {
    onPageChange(state);
    // resolve(results);
  });
};