import React from 'react'
import Message from '../../util/Message'
import Route from '../../models/Route'

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { runs, executeRun, multiPlayback, currentTabId } = this.props;

    const runItem = (run, idx) => (
      <div key={idx} className="run-item grid-row">
        <div className="execute-btn" onClick={() => this.onExecuteRun(run.id)}>
          <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
          {run.name}
        </div>
        {(executeRun === run.id && multiPlayback) && (
          <button className="run-bail" onClick={() => this.onBail()}>{multiPlayback ? "Bail" : "Cancel"}</button>
        )}
      </div>
    );

    return (
      <div className="Popup">
        <div>
          <div className="grid-row">
            <button className={"grid-item btn btn-start" + (currentTabId ? " s6" : "")} onClick={() => this.onOpenTool()}>
              Open SnapTest
            </button>
          </div>
          {currentTabId && (
            <div className="grid-row">
              <button className="grid-item btn btn-primary" onClick={() => Message.promise("setCurrentTab", { currentTabId: null }) }>Disable Testing</button>
            </div>
          )}
          {(runs && runs.length > 0) && (
            <div className="run-list">
              <div className="run-header">Quick Runs</div>
              <div>{runs.map((run, idx) => runItem(run, idx))}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  onExecuteRun(runId) {
    chrome.tabs.getSelected(null, function(tab) {
      Message.promise("setCurrentTab", {currentTabId: tab.id, currentWindowId: tab.windowId});
      Message.promise("pushRoute", {route: new Route("executerun", {runId})}).then(() => Message.promise("executeRun", {runId}))
    });
  }

  onOpenTool() {
    chrome.tabs.getSelected(null, function(tab) {
      Message.promise("setCurrentTab", {currentTabId: tab.id, currentWindowId: tab.windowId});
      Message.to(Message.SESSION, "openWindow", true);
    });
  }

  onBail() {
    Message.promise("resetMultitestPlayback");
  }

}


export default App;