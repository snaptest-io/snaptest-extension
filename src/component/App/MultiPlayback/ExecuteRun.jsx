import React from 'react'
import _ from 'lodash'
import Route from '../../../models/Route'
import Message from '../../../util/Message'

class ExecuteRun extends React.Component {

  constructor(props) {
    super(props);
  }

  getQueuedTestResult(testId) {

    const { multiPlaybackResults } = this.props;

    if (multiPlaybackResults && multiPlaybackResults[testId])
      return multiPlaybackResults[testId];
    else return null;
  }

  render() {

    const {
      multiPlaybackResults,
      multiPlayback,
      activeTest,
      executeRun,
      runs,
      multiPlaybackQueue,
      tests,
      selectedProject
    } = this.props;

    const run = _.find(runs, {id: executeRun});

    if (!run) return (
      <div>
        <div className="grid-row grid-column grid-item execute-run">
          <div className="grid-item grid-row h-align v-align">
            <div className={"grid-row grid-column h-align v-align run-container-bg circle-running"}>
              <div className="run-name">Page Expired</div>
              <button className="btn btn-delete" onClick={() => this.onBail()}>Exit</button>
            </div>
          </div>
        </div>
      </div>
    );

    const precentFinished = !multiPlayback ? 100 : parseInt(((multiPlaybackResults.actions.completed.length) / multiPlaybackResults.actions.total) * 100);
    const playbackFinished = multiPlaybackResults.tests.passed + multiPlaybackResults.tests.failed === multiPlaybackQueue.length;
    const noTestsInRun = multiPlaybackQueue.length === 0;

    const queuedItem = (test, idx) => {

      if (!test) return null;

      const isProcessing = activeTest.id === test.id;
      const result = this.getQueuedTestResult(test.id);
      const isActive = activeTest && activeTest.id === test.id;

      return (
        <div className={"queued-test-row"} key={idx}>
          <div className={"queued-test grid-row v-align" + (isActive ? " active" : "")}>
            {(!result && isProcessing) ? (
              <div className="square">
                RUNNING...
              </div>
            ) : (result) ? (
              <div className={"square" + (result.passed ? " passing": " failing")}>
                {result.passed ? "PASSED" : "FAILED"}
              </div>
            ) : (
              <div className="square">
                TEST
              </div>
            )}
            <div className="grid-item grid-row grid-column">
              <div className="test-name">{test.name}</div>
              {(result && !result.passed) && (
                <div className="test-failure">{result.message}</div>
              )}
            </div>
          </div>
        </div>
      )
    };

    return (
      noTestsInRun ? (
        <div className={"grid-row grid-column h-align v-align execute-run run-container"}>
          {selectedProject && (<div className="project-name">Project: {selectedProject.name}</div>)}
          <div className="run-name">{run.name}</div>
          <div className="warning-message grid-row v-align">
            <svg viewBox="0 0 20 20"><g id="Page-1" fill-rule="evenodd"><g><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-2H9v-2h2v2zm0-3H9V4h2v9z" id="pt-icon-issue-20"/></g></g></svg>
            No tests found. Unable to execute this run.
          </div>
          <button className="btn btn-delete" onClick={() => this.onBail()}>Back</button>
        </div>
      ) : (
        <div className="grid-item grid-row v-align grid-column execute-run run-container">
          {selectedProject && (<div className="project-name">Project: {selectedProject.name}</div>)}
          <div className="run-name">{run.name}</div>
          <div className="warning-message grid-row v-align">
            <svg viewBox="0 0 20 20"><g id="Page-1" fill-rule="evenodd"><g><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-2H9v-2h2v2zm0-3H9V4h2v9z" id="pt-icon-issue-20"/></g></g></svg>
            Please do not close browser. (Switching windows is OK)
          </div>
          {((multiPlayback || playbackFinished) && activeTest) && (
            <div className="grid-row grid-column level">
              <div className="current-test">Running: {activeTest.name}</div>
              <div className="level-indicator">
                <div className="indicator" style={{width: precentFinished + "%"}}></div>
              </div>
            </div>
          )}
          {playbackFinished && (
            <div className={"result" + (multiPlaybackResults.tests.failed > 0 ? " failure" : " success")}>
              {multiPlaybackResults.tests.failed > 0 ? (
                (multiPlaybackResults.tests.failed > 1 ? multiPlaybackResults.tests.failed + " Failures" : "1 Failure")
              ) : "Success!" }
            </div>
          )}
          {playbackFinished ? (
            <div className={"grid-row button-group v-align result-buttons"}>
              <button className="btn btn-secondary" onClick={() => Message.to(Message.SESSION, "backRoute")}>Done</button>
              <a onClick={() => this.onViewResults(run)}>View results</a>
            </div>
          ) : (
            <button className="btn btn-delete" onClick={() => this.onBail()}>{multiPlayback ? "Bail" : "Cancel"}</button>
          )}
          {((multiPlayback || playbackFinished) && activeTest) && (
            <div className="queued-tests grid-item">
              <div className="queued-tests-center">
                {multiPlaybackQueue.map((testId) => _.find(tests, {id: testId})).map(queuedItem)}
              </div>
            </div>
          )}
          </div>
      )
    )
  }

  onViewResults(run) {

    Message.promise("clearResultFilters")
      .then(() =>
        Message.promise("addResultFilter", {filterType: "run", filterEntity: run})
      ).then(() => {
        Message.to(Message.SESSION, "pushRoute", new Route("results"))
      });

  }

  onBail() {
    Message.promise("resetMultitestPlayback").then(() => {
      Message.to(Message.SESSION, "backRoute")
    });
  }

}

export default ExecuteRun;
