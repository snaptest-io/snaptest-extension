import {getDefaultSettings} from "./actions/SettingsActions";
import RouteModel from "./models/Route";
import * as Tut from "./models/tutconsts";
import {initialResultFilters} from './actions/ResultFilterActions'

export function getInitialState(appWindowId) {
  return {

    currentTabId: null,
    primaryWindowId: null,
    activeTabs: [],
    user: null,
    userSettings: getDefaultSettings(),
    sudoer: false,
    plan: {},
    orgs: [],
    projects: [],
    projectGroups: [],
    expandedProjectGroups: [],
    projectReadAccessDenied: false,
    orgAccounts: [],
    contextType: "user",
    contextId: "me",
    selectedOrg: null,
    collaborators: [],
    selectedProject: null,
    premium: false,

    appWindowId: appWindowId ? appWindowId : null,
    appWindowWidth: 1000,
    appWindowX: 100,

    components: [],
    componentDrafts: [],
    tests: [],
    archivedTests: [],
    drafts: [],
    directory: {tree: getDefaultTree("tests")},
    openFolders: [],
    closedProfiles: [],
    activeTest: null,
    activeResult: null,
    activeFolder: null,
    modal: null,
    modalMeta: {},

    multiPlaybackQueue: [], // test id's to be playback
    multiPlaybackResults: getInitialMultiplaybackResults(),
    multiPlayback: false,
    multiPlaybackPaused: false,
    multiReplayingOne: false,
    multiPlaybackDetails: false,

    selectedRows: [],
    expandedActions: [],
    commentedActions: [],
    recentSelectedIndex: null,
    actionSelectorId: null,

    isRecording : false,
    isAssertMode: false,
    isAutoSaving: false,

    isPlayingBack: false,
    playbackCursor: null,
    playbackInstigatorId: null,
    playbackActions: null,
    playbackBreakpoints: [],
    stepOverBreakpoints: [],
    playbackResult: {},
    playbackHasLoadedInitialPage: false,
    playbackInterval: null,
    playbackLoopAmount: null,
    playbackCurrentLoop: 0,
    playbackError: null,

    isSelecting: false,
    selectingForActionId: null,
    selectingForParentActionId: null,
    selectingForAction: null,
    selectionCandidate: null,

    cursorIndex: null, // null means the end of the action list.
    processLoopMS: 0,
    viewStack: [ new RouteModel("dashboard") ],

    generatedCode : "",
    includeHarness: false,
    selectedFramework: "nightwatch",
    selectedStyle: "flat",
    topDirName: "",

    actionElIndicatorSelector: null,
    shouldRefresh: false,
    shouldGenNewTestActions: false,

    // results
    showResultGraph: true,
    resultActionRowView: "action",
    resultUploaded: 0,

    // workspace
    localmode: true,
    autoSaveStatus: "idle",
    syncing: false,

    // view state:
    liveoutput: false,
    showHotkeys: false,
    minimized: false,
    viewMode: "window", // window, maximize, right, left, top, bottom
    viewX: 2,
    viewY: 2,
    viewWidth: 230,
    viewHeight: 25,
    viewTestDescription: false,
    viewTestVars: false,

    //hotkeys
    hotkeyConfig: {
      TOGGLE_VIEW_HOTKEYS: "h",
      BACK: "b",
      MINIMIZE: "m",
      ASSERT_MODE: "a",
      RECORD_MODE: "r",
      CANCEL_MODE: "x",
      NEW_TEST: "n",
      SHOW_CODE: "c",
      DELETE_ROWS: "d",
      CLEAR_SELECTION: "z",
      ROLLUP_SELECTION: "option+c",
      UNDO: "q",
      REDO: "w",
      DOCK_RIGHT: "option+d",
      DOCK_LEFT: "option+a",
      DOCK_BOTTOM: "option+s",
      DOCK_TOP: "option+w",
      DOCK_WINDOW: "option+e",
      DOCK_MAX: "option+q",
      START_PLAYBACK: "t",
      ESCAPE: "esc"
    },

    dataProfiles: [],
    viewingProfile: null,
    selectedProfile: null,

    runs: [],
    editingRun: null,
    executeRun: null,

    tags: [],
    tagIdtoNameMap: {},
    testsInTagsMap: {},
    editingTag: null,

    showTestFilters: false,
    tagTestFilters: [],
    testFilterOperator: "AND",
    resultRunnerIdToEmailMap: {},
    resultRunIdToNameMap: {},
    resultTagIdToNameMap: {},
    resultEnvIdToNameMap: {},

    resultFilters: initialResultFilters(),

    tutorialActivated: false,
    tutorialStep: Tut.getStepName(0),
    tutorialStepNumber: 0,
    splashActivated: SKIP_SPLASH ? false : true,
    hasFamiliarized: SKIP_SPLASH ? true :  false,
    saveWarningActivated: true,

    recentRequestResult: null

  };
}

export function getDefaultTree(toplevelName) {
  return {
    "module": toplevelName,
    topLevel: true,
    showGen: true,
    "children": []
  }
}

export function getInitialMultiplaybackResults() {
  return {
    tests: {
      passed: 0,
      failed: 0,
      total: 0
    },
    patch_tests: {
      passed: 0,
      failed: 0,
      total: 0
    },
    actions: {
      total: 0,
      completed: []
    }
  };
}
