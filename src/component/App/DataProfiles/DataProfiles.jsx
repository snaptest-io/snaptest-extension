import React from 'react'
import Message from '../../../util/Message'
import DataProfile from './DataProfile'

class DataProfiles extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    var { closedProfiles = [], dataProfiles = [], isSwitchingContext, syncing } = this.props;

    return (
      <div className="grid-item grid-row grid-column profiles">
        <div className="header-row grid-row v-align">
          <div className="grid-item grid-row v-align">
            <div onClick={() => this.onExpandAll()} title="view actions" data-tip='Expand all environments' className="undo-redo-icon">
              <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 9c.28 0 .53-.11.71-.29L10 3.41l5.29 5.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71l-6-6C10.53 1.11 10.28 1 10 1s-.53.11-.71.29l-6 6C3.11 7.47 3 7.72 3 8c0 .55.45 1 1 1zm12 2c-.28 0-.53.11-.71.29L10 16.59 4.71 11.3c-.18-.19-.43-.3-.71-.3-.55 0-1 .45-1 1 0 .28.11.53.29.71l6 6c.18.18.43.29.71.29s.53-.11.71-.29l6-6c.18-.18.29-.43.29-.71 0-.55-.45-1-1-1z" id="expand_all_2_"/></svg>
            </div>
            <div onClick={() => this.onCollapseAll()} title="view actions" data-tip='Collapse all environments' className="undo-redo-icon">
              <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.29 8.71c.18.18.43.29.71.29s.53-.11.71-.29l6-6c.18-.18.29-.43.29-.71 0-.55-.45-1-1-1-.28 0-.53.11-.71.29L10 6.59l-5.29-5.3C4.53 1.11 4.28 1 4 1c-.55 0-1 .45-1 1 0 .28.11.53.29.71l6 6zm1.42 2.58c-.18-.18-.43-.29-.71-.29s-.53.11-.71.29l-6 6c-.18.18-.29.43-.29.71 0 .55.45 1 1 1 .28 0 .53-.11.71-.29l5.29-5.3 5.29 5.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71l-6-6z" id="collapse_all_2_"/></svg>
            </div>
          </div>
          <div className="grid-row v-align">
            <button className="btn assert-btn"
                     onClick={() => Message.to(Message.SESSION, "setModal", "create-data-profile")}>+ Environment</button>
            <a target="_blank" href="https://www.snaptest.io/doc/environments">
              <svg className="svg-icon hoverable" viewBox="0 0 20 20"><path id="help_1_" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM7.41 4.62c.65-.54 1.51-.82 2.56-.82.54 0 1.03.08 1.48.25.44.17.83.39 1.14.68.32.29.56.63.74 1.02.17.39.26.82.26 1.27s-.08.87-.24 1.23c-.16.37-.4.73-.71 1.11l-1.21 1.58c-.14.17-.28.33-.32.48-.05.15-.11.35-.11.6v.97H9v-2s.06-.58.24-.81l1.21-1.64c.25-.3.41-.56.51-.77s.14-.44.14-.67c0-.35-.11-.63-.32-.85s-.5-.33-.88-.33c-.37 0-.67.11-.89.33-.22.23-.37.54-.46.94-.03.12-.11.17-.23.16l-1.95-.29c-.12-.01-.16-.08-.14-.22.13-.93.52-1.67 1.18-2.22zM9 14h2.02L11 16H9v-2z"/></svg>
            </a>
          </div>
        </div>
        <div className="content-row profile-list">
          {(isSwitchingContext || syncing) ? (
            <div className="content-loading"><div className="loader"></div></div>
          ) : dataProfiles.length > 0 ? (
            dataProfiles
              .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1)
              .sort((profile) => profile.inherited ? 1 : -1)
              .map((profile, idx) => <DataProfile idx={idx} {...this.props} profile={profile}/>)
          ) : (
            <div className="grid-item grid-row grid-column v-align h-align full-height">
              <h4>No environments yet!</h4>
              <div>
                <a target="_blank" href="https://www.snaptest.io/doc/environments">What are these?</a>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  onExpandAll() {
    Message.to(Message.SESSION, "expandAllProfiles");
  }

  onCollapseAll() {
    Message.to(Message.SESSION, "collapseAllProfiles");
  }

}

export default DataProfiles;
