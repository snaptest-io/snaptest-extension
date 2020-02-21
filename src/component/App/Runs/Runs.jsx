import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message'
import Route from '../../../models/Route'

class Runs extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Message.promise("getRuns");
  }

  render() {

    var { runs = [], isSwitchingContext } = this.props;

    const runItem = (run, idx) => (
      <div key={idx} className="block-list-item grid-row v-align">
        <div className="grid-row v-align execute-btn" onClick={() => this.onExecuteRun(run.id)}>
          <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
          execute run
        </div>
        <div className="title grid-item run-name">
          <a onClick={() => this.onEditRun(run.id)}>
            {run.name}
          </a>
        </div>
        <div className="grid-row v-align" onClick={() => this.onEditRun(run.id)}>
          <svg className="svg-icon hoverable"  viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 8h-2.31c-.14-.46-.33-.89-.56-1.3l1.7-1.7a.996.996 0 0 0 0-1.41l-1.41-1.41a.996.996 0 0 0-1.41 0l-1.7 1.7c-.41-.22-.84-.41-1.3-.55V1c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2.33c-.48.14-.94.34-1.37.58L5 2.28a.972.972 0 0 0-1.36 0L2.28 3.64c-.37.38-.37.99 0 1.36L3.9 6.62c-.24.44-.44.89-.59 1.38H1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2.31c.14.46.33.89.56 1.3L2.17 15a.996.996 0 0 0 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l1.7-1.7c.41.22.84.41 1.3.55V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.33c.48-.14.94-.35 1.37-.59L15 17.72c.37.37.98.37 1.36 0l1.36-1.36c.37-.37.37-.98 0-1.36l-1.62-1.62c.24-.43.45-.89.6-1.38H19c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-9 6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" id="cog_2_"/></svg>
        </div>
      </div>
    );

    return (
      <div className="grid-item grid-row grid-column block-list">
        <div className="header-row grid-row v-align">
          <div className="grid-item"></div>
          <div className="grid-row v-align">
            <button className="btn assert-btn"
                    onClick={() => this.onNewRun()}>+ New Run Config</button>
            <a target="_blank" href="https://www.snaptest.io/doc/runs">
              <svg className="svg-icon hoverable" viewBox="0 0 20 20"><path id="help_1_" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM7.41 4.62c.65-.54 1.51-.82 2.56-.82.54 0 1.03.08 1.48.25.44.17.83.39 1.14.68.32.29.56.63.74 1.02.17.39.26.82.26 1.27s-.08.87-.24 1.23c-.16.37-.4.73-.71 1.11l-1.21 1.58c-.14.17-.28.33-.32.48-.05.15-.11.35-.11.6v.97H9v-2s.06-.58.24-.81l1.21-1.64c.25-.3.41-.56.51-.77s.14-.44.14-.67c0-.35-.11-.63-.32-.85s-.5-.33-.88-.33c-.37 0-.67.11-.89.33-.22.23-.37.54-.46.94-.03.12-.11.17-.23.16l-1.95-.29c-.12-.01-.16-.08-.14-.22.13-.93.52-1.67 1.18-2.22zM9 14h2.02L11 16H9v-2z"/></svg>
            </a>
          </div>
        </div>
        {isSwitchingContext ? (
          <div className="content-loading"><div className="loader"></div></div>
        ) : runs.length === 0 ? (
          <div className="grid-item grid-row grid-column v-align h-align">
            <h4>No runs yet!</h4>
            <div>
              <a target="_blank" href="https://www.snaptest.io/doc/runs">What are these?</a>
            </div>
          </div>
          ) : (
          <div>
            {runs.map((run, idx) => runItem(run, idx))}
          </div>
        )}
      </div>
    )
  }

  onNewRun() {
    Message.to(Message.SESSION, "setEditingRun", null);
    Message.to(Message.SESSION, "setModal", "create-run")
  }

  onEditRun(runId) {
    Message.to(Message.SESSION, "setEditingRun", runId);
    Message.to(Message.SESSION, "setModal", "create-run")
  }

  onExecuteRun(runId) {
    Message.promise("pushRoute", {route: new Route("executerun", {runId})}).then(() => Message.promise("executeRun", {runId}))
  }

}

export default Runs;
