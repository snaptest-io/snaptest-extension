import deepClone from 'deep-clone'
import {buildTagMap} from './TagActions'

export const importData = (params, state) => {

  const { data } = params;
  
  state.tests = data.tests || [];
  state.components = data.components || [];
  state.directory.tree = data.directory.tree;
  state.runs = data.runs || [];
  state.tags = data.tags || [];

  state.dataProfiles = data.dataProfiles || [];

  if (data.settings) state.userSettings = data.settings;

  // patch for older export structure:
  if (data.testsInTagsMap) {
    state.testsInTagsMap = data.testsInTagsMap || {};
  } else {

    data.tests.forEach((test) => {
      if (test.tags && test.tags.length > 0) {
        state.testsInTagsMap[test.id] = test.tags;
      }
    });

    state.tagIdtoNameMap = buildTagMap(data.tags);

  }

};

export const prepExportData = (params, state) => {
  return new Promise((resolve) => {

    const { components, directory, runs, userSettings, testsInTagsMap } = state;

    var tests = deepClone(state.tests);
    var dataProfiles = deepClone(state.dataProfiles).map((env) => ({...env, inherited: false}));
    var tags = deepClone(state.tags).map((tag) => ({...tag, inherited: false}));

    for (var testId in testsInTagsMap) {
      var test = _.find(tests, {id: testId});

      if (test) {
        test.tags = testsInTagsMap[testId];
      }
    }

    resolve({
      tests, components, directory, dataProfiles, runs, userSettings, tags
    });

  })
};

