import React from 'react'
import _ from 'lodash'
import ActionItemLine from '../Recorder/ActionItemLine'
import {Dropdown} from '../../'
import Message from '../../../util/Message'

class MultiPlayback extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saveError: null
    }
  }

  render() {

    const {
      multiPlaybackQueue,
      tests,
      activeTest = { },
      isAssertMode,
      playbackInterval,
      playbackLoopAmount,
      isPlayingBack,
      isRecording,
      expandedActions,
      cursorIndex,
      selectedRows,
      components,
      selectingForActionId,
      selectionCandidate,
      playbackResult,
      playbackCursor,
      playbackBreakpoints,
      multiPlaybackResults,
      multiPlaybackDetails,
      multiPlaybackFolderString,
      multiPlayback,
      userSettings,
      activeResult,
      selectedProject,
      tagTestFilters,
      tagIdtoNameMap,
      currentRoute,
      localmode,
      resultUploaded,
    } = this.props;

    const isPatch = currentRoute.name === "patchrun";

    if (!activeTest) {
      return isPatch ? (
        <div className="multi-empty">
          <div className="reason">
            Couldn't find any tests to patch.
          </div>
          <div className="explanation">
            Tests to patch may have been deleted.
          </div>
        </div>
      ) : (
        <div className="multi-empty">
          <div className="reason">
            Couldn't find any tests to run.
          </div>
        </div>
      )
    }

    const { saving, saveError } = this.state;
    const actions = (activeTest && activeTest.actions) ? activeTest.actions : [];
    const testsPassed = isPatch ? (multiPlaybackResults.patch_tests.passed + multiPlaybackResults.tests.passed) : multiPlaybackResults.tests.passed;
    const testsTotal = isPatch ? multiPlaybackResults.patch_tests.total : multiPlaybackResults.tests.total;
    const complete = multiPlaybackQueue.length !== 0 && (multiPlaybackResults.tests.passed + multiPlaybackResults.tests.failed) >= multiPlaybackQueue.length;
    const passed = (multiPlaybackQueue.length !== 0 && testsPassed >= testsTotal);

    const queuedItem = (test, idx) => {

      if (!test) return null;

      const isProcessing = activeTest.id === test.id;
      const result = this.getQueuedTestResult(test.id);
      const isActive = activeTest && activeTest.id === test.id;

      return (
        <div className={"queued-test-row"} key={idx}>
          <div className={"queued-test grid-row v-align" + (isActive ? " active" : "")} onClick={() => this.onQueuedTestClick(test)}>
            <div>
              {result ? (
                <span className={"result-tag" + (result.passed ? " passed": " failed")}>
                  {result.passed ? "PASSED" : "FAILED"}
                </span>
              ) : (isProcessing && multiPlayback) ? (
                <span className="result-tag pending">RUNNING...</span>
              ) : (
                <span className="result-tag">QUEUED</span>
              )}
            </div>
            <div className="grid-item">
              {test.name}
            </div>
            <div>
              {(result && !result.passed && !multiPlayback) && (
                <button className={"btn btn-primary play-btn"}
                        onClick={(e) => { this.onReplayTest(test.id) }} title="Replay test">Replay</button>
              )}
            </div>
          </div>
          {(result && !result.passed) && (
            <div className="failure">{result.message}</div>
          )}
        </div>
      )
    };

    return (
      <div className="multi-playback grid-row grid-column grid-item">
        <div className="grid-row playback-tools">
            <button className={"btn btn-primary play-btn grid-row v-align" + (multiPlayback ? " active" : "")}>
              {!multiPlayback && (
                <Dropdown classNames=""
                          onClick={(e) => e.stopPropagation()}
                          button={
                            <img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick-white.png")} />
                          }>
                  <div>
                    {(playbackInterval || playbackLoopAmount) && ([
                      <div key={0} className="dd-item grid-row"
                           onClick={() => {Message.to(Message.SESSION, "setPlaybackInterval", null); Message.to(Message.SESSION, "setPlaybackLoopAmount", null)}}>
                        <div className="grid-item">Reset</div>
                      </div>,
                      <hr key={1} />
                    ])}
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackInterval", null)}>
                      <div className="grid-item">Play</div>
                      <div className="lower-case">(no delay)</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackInterval", 500)}>
                      <div className="grid-item">Play Slow</div>
                      <div className="lower-case">(500 ms)</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackInterval", 1500)}>
                      <div className="grid-item">Play Super Slow</div>
                      <div className="lower-case">(1500 ms)</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setModal", "custom-delay")}>
                      <div className="grid-item">Set Custom</div>
                    </div>
                  </div>
                </Dropdown>
              )}
              {!multiPlayback ? (
                <div className="btn-label" onClick={() => this.onStartPlayback() }>
                  <span>{isPatch ? "Start Patch" : "Play all"} {playbackInterval && (<span className="lower-case small">({playbackInterval + "ms delay"})</span>)}</span>
                </div>
              ) : (
                <div className="btn-label">
                  <span>{isPatch ? "Patching..." : "Playing..."}</span>
                </div>
              )}
            </button>
          {multiPlayback && (
            <button className={"btn bail-btns"} onClick={() => this.onResetPlayback() }>
              Bail
            </button>
          )}
          {!multiPlayback && complete && (
            <button className={"btn bail-btns"} onClick={() => this.onResetPlayback() }>
              Reset
            </button>
          )}
          <div className="grid-item"></div>
          <div className="grid-row v-align">
            <a onClick={() => Message.to(Message.SESSION, "setMultiplaybackDetails", !multiPlaybackDetails) }>
              {multiPlaybackDetails ? "Hide" : "View" } Debug Mode
            </a>
          </div>
        </div>
        <div className="test-queue grid-item">
          {multiPlaybackQueue.map((testId) => _.find(tests, {id: testId})).map(queuedItem)}
        </div>
        <div className="results grid-row v-align">
          <div className="ResultRow">
            <div className="result-container grid-row grid-column">
              <div className="grid-row">
                <div className={"result grid-row grid-column v-align h-align" + (passed ? " success" : "")} >
                  <div className="result-summary">{testsPassed}/{testsTotal} <span className="test-lable">tests</span></div>
                  <div className="result-date">Date</div>
                  <div className="result-date">{multiPlaybackResults.duration}ms</div>
                </div>
                <div className="result-details grid-item grid-row grid-column">
                  <div className="result-name grid-row v-align">
                    {multiPlaybackFolderString}
                  </div>
                  <div className="result-metas">
                    {selectedProject && (
                      <div className="result-meta project">
                        <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.94 17a4.92 4.92 0 0 0-.33-1.06c-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15a3.648 3.648 0 0 1 1.4-2.36C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73a3.63 3.63 0 0 1 1.4 2.36c.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></svg>
                        {selectedProject.name}
                      </div>
                    )}
                    {tagTestFilters && tagTestFilters.map((tagId, idx) => (
                      <div className="result-meta tag" key={idx}>
                        <svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
                        {tagIdtoNameMap[tagId]}
                      </div>
                    ))}
                  </div>
                </div>
                { complete && (
                  <div className="grid-row v-align h-align button-row">
                    <button className="btn btn-with-icon" onClick={() => Message.to(Message.SESSION, "setModal", {name: "view-results" })}>
                      <svg viewBox="0 0 20 20"><path d="M10.01 7.984A2.008 2.008 0 0 0 8.012 9.99c0 1.103.9 2.006 1.998 2.006a2.008 2.008 0 0 0 1.998-2.006c0-1.103-.9-2.006-1.998-2.006zM20 9.96v-.03-.01-.02-.02a.827.827 0 0 0-.21-.442c-.64-.802-1.398-1.514-2.168-2.166-1.658-1.404-3.566-2.587-5.664-3.058a8.982 8.982 0 0 0-3.656-.05c-1.11.2-2.178.641-3.177 1.183-1.569.852-2.997 2.016-4.246 3.33-.23.25-.46.49-.67.761-.279.351-.279.773 0 1.124.64.802 1.4 1.514 2.169 2.166 1.658 1.404 3.566 2.577 5.664 3.058 1.209.271 2.438.281 3.656.05 1.11-.21 2.178-.651 3.177-1.193 1.569-.852 2.997-2.016 4.246-3.33.23-.24.46-.49.67-.751.11-.12.179-.271.209-.442v-.02-.02-.01-.03V10v-.04zM10.01 14A4.003 4.003 0 0 1 6.014 9.99a4.003 4.003 0 0 1 3.996-4.011 4.003 4.003 0 0 1 3.996 4.011 4.003 4.003 0 0 1-3.996 4.011z" fill-rule="nonzero"/></svg>
                      View
                    </button>
                    {complete && (
                      <div className="grid-row v-align">
                        {saveError && (
                          <div className="upload-error">{saveError}</div>
                        )}
                        {(activeResult && activeResult.content && !localmode) && (
                          saving ? (
                            <button className="btn recording-btn saving">
                              Saving...
                            </button>
                          ) : (
                            <button className="btn recording-btn"
                                    onClick={() => this.onSaveResult()}>
                              Save result
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {multiPlaybackDetails && (
          <div className="grid-item test-runner" ref="actionlist">
            {actions.map((action, idx) => (
              <ActionItemLine action={action}
                              isInComponent={false}
                              isEditable={false}
                              idx={idx}
                              components={components}
                              activeTest={activeTest}
                              onNWRowClick={(action, idx) => this.onNWRowClick(action, idx) }
                              selectedRows={selectedRows}
                              isLast={idx === actions.length - 1}
                              isFirst={idx === 0}
                              isCursorHere={cursorIndex === idx && (isRecording || isAssertMode)}
                              isAssertMode={isAssertMode}
                              isRecording={isRecording}
                              isPlayingBack={isPlayingBack}
                              selectingForActionId={selectingForActionId}
                              selectionCandidate={selectionCandidate}
                              playbackResult={playbackResult}
                              playbackCursor={playbackCursor}
                              playbackBreakpoints={playbackBreakpoints}
                              expandedActions={expandedActions}
                              userSettings={userSettings} />
            ))}
          </div>
        )}
      </div>
    )
  }

  onSaveResult() {

    this.setState({saving: true, saveError: false});

    Message.promise("savePendingResult")
      .then(() => setTimeout(() => this.setState({saving: false}), 800))
      .catch((e) => {
        console.log(e);
        this.setState({saving: false, saveError: e})
      });

  }

  getQueuedTestResult(testId) {

    const { multiPlaybackResults } = this.props;

    if (multiPlaybackResults && multiPlaybackResults[testId])
      return multiPlaybackResults[testId];
    else return null;
  }

  onQueuedTestClick(test) {
    const { multiPlayback } = this.props;

    if (!multiPlayback) {
      Message.to(Message.SESSION, "setTestActive", test.id);
    }
  }

  onReplayTest(testId) {
    Message.promise("multiReplayOneTest", {testId});
  }

  onStartPlayback() {

    const isPatch = this.props.currentRoute.name === "patchrun";

    if (isPatch) Message.promise("executePatch");
    else Message.promise("executeCombo");

  }

  onResetPlayback() {
    Message.promise("resetMultitestPlayback");
  }

  componentDidUpdate() {

    // logic for the screen to follow the playback cursor

    const { isPlayingBack, playbackCursor } = this.props;

    if (isPlayingBack && this.refs.actionlist && playbackCursor) {

      if (playbackCursor.indexOf("COMPONENT") === -1) {

        var latestAction = document.querySelector("[data-id=" + playbackCursor + "]");
        if (latestAction) this.refs.actionlist.scrollTop = (latestAction.offsetTop - 500);

      } else {
        var cursorTokens = playbackCursor.split("COMPONENT");

        var latestAction = document.querySelector("[data-id=" + playbackCursor + "]");
        var latestComponent = document.querySelector("[data-id=" + cursorTokens[0] + "]");

        if (latestAction && latestComponent) {
          this.refs.actionlist.scrollTop = ((latestAction.offsetTop + latestComponent.offsetTop) - 500);
        }

      }

    }

  }

}

export default MultiPlayback;
