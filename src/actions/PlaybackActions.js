import _ from 'lodash'
import {playbackEngine} from '../managers/playback/playbackEngine';
import Message from '../util/Message'
import * as ResultActions from './ResultActions'
import {generate as generateId} from 'shortid'
import deepClone from 'deep-clone'
import {countActions} from '../util/TestUtils';
import { findNodeById, walkThroughTreeNodes } from '../util/treeUtils';
import { getFilteredTestsInfo } from '../util/TestFilterUtils';
import {setCurrentAsActiveTab} from './ModeActions'
import {clearScreenshotCache} from "../managers/ScreenshotManager";
import {getInitialMultiplaybackResults} from "../initialState";

/*
 * Active Test Playback:
 * Plays the activeTest using the active environment variables.
 */

var playbackInstance = null;
var pendingResult = null;

export const startActiveTestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {

    setCurrentAsActiveTab(state).then(() => {

      clearScreenshotCache();

      pendingResult = {
        name: state.activeTest.name,
        type: "single",
        run_id: null,
        env_id: state.selectedProfile,
        folder_id: null,
        runner_id: state.user && state.user.id,
        actions_passed: 0,
        actions_failed: 0,
        tag_ids: state.testsInTagsMap[state.activeTest.id],
        tests: [state.activeTest.id],
        tests_passed: [],
        tests_num: 1,
        tests_passed_num: 0,
        duration: 0,
        content: {
          tests: [],
          csvs: []
        }
      };

      playbackInstance = playbackEngine(state, {
        onComplete: (testResult, generatedData) => {

          // Get out if there is a row selection.
          if (state.selectedRows.length > 0) {
            Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
            return;
          }

          pendingResult.content.tests = [testResult];
          pendingResult.content.csvs = generatedData.csvs;
          pendingResult.duration = pendingResult.content.tests.map((testResult) => testResult.duration).reduce((total, next) => total + next);
          pendingResult.actions_passed = pendingResult.content.tests.map((testResult) => testResult.totalActions).reduce((total, next) => total + next);
          pendingResult.actions_failed = pendingResult.content.tests.map((testResult) => testResult.totalFailing).reduce((total, next) => total + next);
          pendingResult.tests_passed = pendingResult.content.tests.filter((result) => !result.error).map((result) => result.testId);

          pendingResult.tests_num = 1;
          pendingResult.tests_passed_num = pendingResult.tests_passed.length;

          ResultActions.stagePendingResult({pendingResult}, state);

          Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});

        },
        onLoopComplete: (testResult) => {
          pendingResult.tests = [testResult];
          pendingResult.duration = testResult.duration;
        },
        onActionResult: () => {
          Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
        },
        onError: (error) => {
          // log the error.
          state.playbackError = error;
          Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
        },
        onPause: () => {
          Message.toAll("stateChange", {...state, tests: [], testsExcluded: true})
        },
        onActionStaged: () => {
          Message.toAll("stateChange", {...state, tests: [], testsExcluded: true})
        }
      }, { pendingResult } );

      playbackInstance.begin();
      resolve();
    }).catch((error) => {
      state.playbackError = error;
      Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
    });

  });
};

export const clearActiveTestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {
    pendingResult = null;
    if (playbackInstance) {
      playbackInstance.destroy();
      playbackInstance = null;
    }
    resolve();
  });
};

export const toggleActiveTestBreakpoint = (params, state) => {
  return new Promise((resolve, reject) => {

    var indexOfBreakpoint = state.playbackBreakpoints.indexOf(params.actionId);

    if (indexOfBreakpoint === -1) state.playbackBreakpoints.push(params.actionId)
    else state.playbackBreakpoints.splice(indexOfBreakpoint, 1);

    resolve();

  });
};

export const pauseActiveTestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {
    if (playbackInstance) playbackInstance.pause();
    resolve();
  });
};

export const resumeActiveTestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {
    if (playbackInstance) playbackInstance.resume();
    resolve();
  });
};

export const stepActiveTestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {
    if (playbackInstance) playbackInstance.step();
    resolve();
  });
};

/*
 * MultiTest Playback:
 */

var testQueue = null;

export const startMultitestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {
    setCurrentAsActiveTab(state).then(() => {

      clearScreenshotCache();

      var runType = params.runType || "combo";
      var run, runId, folderId, name, patchOf;
      var selectedEnvId = state.selectedProfile;
      var name = state.multiPlaybackFolderString;

      if (runType === "run") {
        runId = state.executeRun; // TODO: refactor how we pass this in? a little opaque.
        run = _.find(state.runs, {id: runId});
        selectedEnvId = run.env;
        name = run.name;
      } else if (runType === "patch") {
        name = "Patch.";
        patchOf = state.activeResult.id;
        selectedEnvId = state.activeResult.env_id;
      } else {
        // combo case
        name = state.multiPlaybackFolderString;
        folderId = state.multiPlaybackFolderId;
      }

      pendingResult = {
        name,
        type: runType,
        run_id: runId,
        env_id: selectedEnvId,
        folder_id: folderId,
        runner_id: state.user && state.user.id,
        actions_passed: 0,
        actions_failed: 0,
        tag_ids: run ? [] : state.tagTestFilters,
        tests: state.multiPlaybackQueue,  // Set when changing routes to a multiplayback page.
        tests_passed: [],
        tests_num: state.multiPlaybackQueue.length,
        tests_passed_num: 0,
        duration: 0,
        content: {
          tests: [],
          csvs: []
        },
        patch_of: patchOf
      };

      // View state variables:
      state.multiPlayback = true;
      state.multiPlaybackPaused = false;
      testQueue = state.multiPlaybackQueue.map((testId) => _.find(state.tests, {id: testId}));
      state.multiPlaybackResults.actions.total = countTotalActionsInQueue(state);

      runTestsInQueue(state, selectedEnvId);

      return resolve();

    });
  });
};

export const executeCombo = (params, state) => {
  return resetMultitestPlayback(params, state).then(() => {
    params.runType = "combo";
    return startMultitestPlayback(params, state)
  });
};

export const executeRun = (params, state) => {
  return resetMultitestPlayback(params, state).then(() => {

    const { runId } = params;

    params.runType = "run";
    state.executeRun = runId;

    var run = _.find(state.runs, {id: runId});
    if (!run) return;

    state.multiPlaybackQueue = [];
    state.multiPlaybackFolderString = run.name;

    // first we need to apply the tests in the folder.
    if (run.folder === "all") {
      walkThroughTreeNodes(state.directory.tree, (node) => { if (node.type === "test") state.multiPlaybackQueue.push(node.testId); });
    } else {
      var folderNode = findNodeById(state.directory.tree, run.folder);
      if (!folderNode) return;
      walkThroughTreeNodes(folderNode, (node) => { if (node.type === "test") state.multiPlaybackQueue.push(node.testId); });
    }

    if (_.isArray(run.tags) && run.tags.length > 0) {
      // then apply the test filters on the run.
      var filteredTests = getFilteredTestsInfo(state.directory, run.tags, state.testsInTagsMap, run.tags_and === 1 ? "AND" : "OR");
      state.multiPlaybackQueue = state.multiPlaybackQueue.filter((testId) => filteredTests.testIds.indexOf(testId) !== -1);
    }

    // set the first active test.
    state.activeTest = _.find(state.tests, {id: state.multiPlaybackQueue[0]});

    return startMultitestPlayback(params, state)

  });
};

export const executePatch = (params, state) => {

  state.multiPlaybackResults = getInitialMultiplaybackResults();
  state.multiPlaybackResults.patch_tests.total = state.activeResult.tests.length;
  state.multiPlaybackResults.patch_tests.passed = state.activeResult.tests_passed.length;
  state.multiPlaybackResults.patch_tests.failed = state.multiPlaybackQueue.length;

  return resetMultitestPlayback({... params, multiPlaybackResults: state.multiPlaybackResults}, state).then(() => {

    params.runType = "patch";

    return startMultitestPlayback(params, state)

  });

};

function countTotalActionsInQueue(state) {
  var actionCount = 0;

  // count up all the actions in the queue...
  testQueue.forEach((test) => {
    actionCount += countActions(test, state);
  });

  return actionCount;
}

export const resetMultitestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {

    const { multiPlaybackResults } = params;

    if (playbackInstance) playbackInstance.destroy();
    playbackInstance = null;
    pendingResult = null;
    testQueue = null;
    state.multiPlayback = false;
    state.multiPlaybackPaused = false;
    state.multiReplayingOne = false;

    if (multiPlaybackResults) {
      state.multiPlaybackResults = multiPlaybackResults
    } else {
      state.multiPlaybackResults = multiPlaybackResults ? multiPlaybackResults : getInitialMultiplaybackResults();
      state.multiPlaybackResults.tests.total = state.multiPlaybackQueue.length;
    }

    resolve();
  });
};

export const multiReplayOneTest = (params, state) => {
  return new Promise((resolve, reject) => {

    state.multiPlayback = true;
    state.multiPlaybackPaused = false;
    testQueue = [_.find(state.tests, {id: params.testId})];
    runTestsInQueue(state);

    resolve();

  });
};

export const pauseMultitestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {
    if (playbackInstance) {
      state.multiPlaybackPaused = true;
      playbackInstance.pause();
    }
    resolve();
  });
};

export const resumeMultitestPlayback = (params, state) => {
  return new Promise((resolve, reject) => {
    if (playbackInstance) {
      state.multiPlaybackPaused = false;
      playbackInstance.resume();
    }
    resolve();
  });
};

function runTestsInQueue(state, selectedEnvId) {

  var currentIdx = 0;

  function runTest() {

    if (!testQueue) return; // bailed case.

    state.activeTest = testQueue[currentIdx];
    Message.toAll("stateChange", {...state});

    playbackInstance = playbackEngine(state, {
      onComplete: (testResult) => {

        state.multiPlaybackResults[state.activeTest.id] = {};
        state.multiPlaybackResults[state.activeTest.id].playbackResult = deepClone(state.playbackResult);
        state.multiPlaybackResults.duration += testResult.duration;

        if (!testResult.error) {
          state.multiPlaybackResults.tests.passed++;
          state.multiPlaybackResults[state.activeTest.id].passed = true;
          state.multiPlaybackResults[state.activeTest.id].message = "PASSED";
        }
        else {
          state.multiPlaybackResults.tests.failed++;
          state.multiPlaybackResults[state.activeTest.id].passed = false;
          state.multiPlaybackResults[state.activeTest.id].message = testResult.error;
        }

        pendingResult.content.tests.push(testResult);
        currentIdx++;
        playbackInstance.destroy();
        playbackInstance = null;

        if (testQueue[currentIdx]) return runTest();


        // ---------- Final results -------------
        pendingResult.duration = pendingResult.content.tests.map((testResult) => testResult.duration).reduce((total, next) => total + next);
        pendingResult.actions_passed = pendingResult.content.tests.map((testResult) => testResult.totalActions).reduce((total, next) => total + next);
        pendingResult.actions_failed = pendingResult.content.tests.map((testResult) => testResult.totalFailing).reduce((total, next) => total + next);
        pendingResult.tests_passed = pendingResult.content.tests.filter((result) => !result.error).map((result) => result.testId);
        pendingResult.tests_passed_num = pendingResult.tests_passed.length;

        if (pendingResult.type === "combo" || pendingResult.type === "patch") {
          ResultActions.stagePendingResult({pendingResult}, state);
        } else {
          ResultActions.addResult({result: pendingResult}, state);
        }

        state.multiPlayback = false;
        Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});

      },
      onActionResult: (actionResult) => {

        state.multiPlaybackResults.actions.completed.push(actionResult.actionId);

        if (state.executeRun) {
          Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
        }
        else if (state.multiPlaybackDetails) {
          Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
        }

      },
      onError: (error) => {
        state.playbackError = error;
        Message.toAll("stateChange", {...state, tests: [], testsExcluded: true});
      }
    }, {
      envId: selectedEnvId
    });

    playbackInstance.begin();

  }

  runTest();

}