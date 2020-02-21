export function resetModes(state) {
  state.isRecording = false;
  state.isAssertMode = false;
  state.isSelecting = false;
  state.playbackError = null;
  state.selectingForActionId = null;
  state.selectingForAction = null;
  state.selectionCandidate = null;
  state.isPlayingBack = false;
  state.playbackActions = null;
  state.playbackCursor = null;
  state.playbackInstigatorId = null;
  state.stepOverBreakpoints = [];
  state.playbackHasLoadedInitialPage = false;
}

export function resetModesAndPlayback(state) {
  resetModes(state);
  state.isPlayingBack = false;
  state.playbackResult = {};
  state.activeTabs = [];
}


export function onPageChange(state) {
  resetModes(state);
  state.cursorIndex = null;
  state.selectedRows = [];
  state.recentSelectedIndex = null;
  state.playbackResult = {};
  state.expandedActions = [];
  state.commentedActions = [];
  state.playbackCurrentLoop = 0;
  state.playbackLoopAmount = null;
  state.playbackInterval = null;
  state.playbackBreakpoints = [];
  state.stepOverBreakpoints = [];
  state.multiPlaybackQueue = [];
  state.multiPlaybackResults= {total: {passed: 0, failed: 0}, actions: {total: 0, completed: []}};
  state.multiPlayback = false;
  state.multiPlaybackPaused = false;
  state.multiReplayingOne = false;
  state.playbackError = null;
  state.executeRun = null;
  state.recentRequestResult = null;
}