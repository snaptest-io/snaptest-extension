import React from 'react'
import _ from 'lodash'
import {Dropdown} from '../../../component'
import ViewModeDropdown from '../Dropdowns/ViewModeDropdown'
import AccountDropdown from '../Dropdowns/AccountDropdown';
import Message from '../../../util/Message'
import Route from '../../../models/Route'
import {getExtendedVariables} from '../../../util/EnvUtils'
import TestDetailsHeader from '../Recorder/TestDetailsHeader'
import TestDetailsBody from "../Recorder/TestDetailsBody";
import withSplitPaneInfo from '../../SplitPanes/SplitPaneProvider'

class DashboardHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      syncing: false
    }

  }

  render() {

    const {
      localmode,
      currentRoute,
      lastRoute,
      noBorder = false,
      noSpacing = false,
      dataProfiles,
      selectedProfile,
      showEnvs = false,
      showAccounts = false,
      showAutoSaveStatus = false,
      autoSaveStatus,
      showBackToDashboard = false,
      showTestHeader,
      activeTest,
      showMenu = false,
      section,
      globalHeader = false,
      hideBackButton = false,
      viewStack,
      viewTestDescription,
      viewTestVars,
      tags = [],
      tagIdtoNameMap,
      isScreenSplit,
      hideConfig = false
    } = this.props;

    const testTags = activeTest ? (this.props.testsInTagsMap[activeTest.id] || []) : [];
    const environment = _.find(dataProfiles, {id: selectedProfile});
    const { syncing } = this.state;

    return (
      <div className={"top-menu-container" + (noBorder ? " no-border" : "") + (globalHeader ? " global-header" : "") + (noSpacing ? " no-spacing" : "")}>
        <div className="grid-row">
          <div className="icon-bar">
            { showBackToDashboard && (
              <svg className="svg-icon hoverable back-button" onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("dashboard"))} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 9H4.41L8.7 4.71c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71l-6 6c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l6 6a1.003 1.003 0 0 0 1.42-1.42L4.41 11H18c.55 0 1-.45 1-1s-.45-1-1-1z" id="left_arrow_1_"/></svg>
            )}
            {(localmode) ? (
              null
            ) : (showAutoSaveStatus && (autoSaveStatus === "loading" || syncing)) ? (
              <svg className={"autosave-indicator svg-icon hoverable " + (autoSaveStatus)} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 4c-.12 0-.24.03-.36.04C13.83 1.69 11.62 0 9 0 5.69 0 3 2.69 3 6c0 .05.01.09.01.14A3.98 3.98 0 0 0 0 10c0 2.21 1.79 4 4 4h.78c.55-.61 1.34-1 2.22-1v-2c0-1.66 1.34-3 3-3s3 1.34 3 3v2c.88 0 1.66.38 2.2.98C17.87 13.87 20 11.69 20 9c0-2.76-2.24-5-5-5zm-2 11c-.28 0-.53.11-.71.29L11 16.59V11c0-.55-.45-1-1-1s-1 .45-1 1v5.59L7.71 15.3A.965.965 0 0 0 7 15a1.003 1.003 0 0 0-.71 1.71l3 3c.18.18.43.29.71.29s.53-.11.71-.29l3-3A1.003 1.003 0 0 0 13 15z" id="cloud_download_3_"/></svg>
            ) : (showAutoSaveStatus && autoSaveStatus === "idle") ? (
              <svg className={"autosave-indicator svg-icon hoverable " + (autoSaveStatus)} onClick={() => this.onSyncClick()}  viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 1c-.55 0-1 .45-1 1v2.06C16.18 1.61 13.29 0 10 0 4.48 0 0 4.48 0 10c0 .55.45 1 1 1s1-.45 1-1c0-4.42 3.58-8 8-8 2.52 0 4.76 1.18 6.22 3H15c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 8c-.55 0-1 .45-1 1 0 4.42-3.58 8-8 8-2.52 0-4.76-1.18-6.22-3H5c.55 0 1-.45 1-1s-.45-1-1-1H1c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1v-2.06C3.82 18.39 6.71 20 10 20c5.52 0 10-4.48 10-10 0-.55-.45-1-1-1z" id="refresh_1_"/></svg>
            ) : showAutoSaveStatus ? (
              <svg className={"autosave-indicator svg-icon hoverable " + (autoSaveStatus)} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.71 10.29c-.18-.18-.43-.29-.71-.29s-.53.11-.71.29l-3 3a1.003 1.003 0 0 0 1.42 1.42L9 13.41V19c0 .55.45 1 1 1s1-.45 1-1v-5.59l1.29 1.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71l-3-3zM15 4c-.12 0-.24.03-.36.04C13.83 1.69 11.62 0 9 0 5.69 0 3 2.69 3 6c0 .05.01.09.01.14A3.98 3.98 0 0 0 0 10c0 2.21 1.79 4 4 4 0-.83.34-1.58.88-2.12l3-3a2.993 2.993 0 0 1 4.24 0l3 3-.01.01c.52.52.85 1.23.87 2.02C18.28 13.44 20 11.42 20 9c0-2.76-2.24-5-5-5z" id="cloud_upload_1_"/></svg>
            ) : null}
          </div>
          <div className="grid-item grid-row v-align db-title">
            {showMenu && (
              <div className="top-menu">
                <div className={"menu-item" + (section === "tests" ? " active" : "")}
                     onClick={() => this.onDashboardLinkClick()}>Tests</div>
                <div className={"menu-item" + (section === "environments" ? " active" : "")}
                     onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("dataprofiles"))}>Envs</div>
                <div className={"menu-item" + (section === "tags" ? " active" : "")}
                     onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("tags"))}>Tags</div>
                <div className={"menu-item" + (section === "runs" ? " active" : "")}
                     onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("runs"))}>Runs</div>
                <div className={"menu-item" + (section === "results" ? " active" : "")}
                     onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("results"))}>Results</div>
              </div>
            )}
            {showTestHeader && (
              <div className="grid-item">
                <TestDetailsHeader viewTestDescription={viewTestDescription}
                                   viewTestVars={viewTestVars}
                                   activeTest={activeTest}
                                   currentRoute={currentRoute}
                                   lastRoute={lastRoute}
                                   tags={tags}
                                   testTags={testTags}
                                   tagIdtoNameMap={tagIdtoNameMap}
                                   isMultiPane={isScreenSplit} />
                <TestDetailsBody viewTestDescription={viewTestDescription}
                                 viewTestVars={viewTestVars}
                                 activeTest={activeTest}
                                 tags={tags}
                                 testTags={testTags}
                                 tagIdtoNameMap={tagIdtoNameMap}/>
              </div>
            )}
          </div>
          {showEnvs && (
            <Dropdown classNames="env-dd grid-row" button={
              <div className="workspace-button">
                <div className="workspace-label">
                  <div className={"env" + (!environment ? " default-env" : "")}>{environment ? environment.name : 'No Environment'}</div>
                  <img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick.png")} />
                </div>
              </div>
              }>
              <div className="dd-header">Environments</div>
              <div className="env-list" onClick={(e) => e.stopPropagation()}>
                <div className="dd-item dd-item-env" onClick={(e) => { Message.to(Message.SESSION, "setSelectedDataProfile", "none")}}>
                  <div className="env default-env">No Environment</div>
                </div>
                {dataProfiles.filter((profile) => !profile.hidden).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1).map((dataProfile) => (
                  <div className="dd-item dd-item-env" onClick={(e) => { Message.to(Message.SESSION, "setSelectedDataProfile", dataProfile.id)}}>
                    <div className="env">{dataProfile.name}</div>
                  </div>
                ))}
              </div>
              <div className="dd-item" onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("dataprofiles"))}>Manage environments</div>
              {environment && (
                <div>
                  <hr />
                  <div onClick={(e) => e.stopPropagation()}>
                    <div className="dd-header">Variables</div>
                      <div className="var-list">
                      {getExtendedVariables(environment, dataProfiles).map((variable, idx) => (
                        <div className="dd-item-variable" key={idx}>{"${" + variable.name + "}"} = {variable.defaultValue}</div>
                      ))}
                      </div>
                  </div>
                </div>
              )}
            </Dropdown>
          )}
          {showAccounts && <AccountDropdown {...this.props} />}
          {!hideConfig && (
            <svg onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("projectsettings"))}
                 className="svg-icon hoverable project-settings"
                 viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 8h-2.31c-.14-.46-.33-.89-.56-1.3l1.7-1.7a.996.996 0 0 0 0-1.41l-1.41-1.41a.996.996 0 0 0-1.41 0l-1.7 1.7c-.41-.22-.84-.41-1.3-.55V1c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2.33c-.48.14-.94.34-1.37.58L5 2.28a.972.972 0 0 0-1.36 0L2.28 3.64c-.37.38-.37.99 0 1.36L3.9 6.62c-.24.44-.44.89-.59 1.38H1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2.31c.14.46.33.89.56 1.3L2.17 15a.996.996 0 0 0 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l1.7-1.7c.41.22.84.41 1.3.55V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.33c.48-.14.94-.35 1.37-.59L15 17.72c.37.37.98.37 1.36 0l1.36-1.36c.37-.37.37-.98 0-1.36l-1.62-1.62c.24-.43.45-.89.6-1.38H19c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-9 6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" id="cog_2_"/></svg>
          )}
          <ViewModeDropdown {...this.props} />
        </div>
      </div>
    )
  }

  onDashboardLinkClick() {
    Message.to(Message.SESSION, "pushRoute", new Route("dashboard", null, { allowReplace: this.props.isScreenSplit }) )
  }

  onSyncClick() {

    this.setState({syncing: true});
    Message.to(Message.SESSION, "setSyncing", true);

    Promise.all([
      Message.promise("getOrgs", {includeaccounts: true}),
      Message.promise("getRuns"),
      Message.promise("getTags"),
      Message.promise("getTestData")
    ]).then(() => {
      Message.to(Message.SESSION, "setSyncing", false);
      this.setState({syncing: false});
    }).catch(() => {
      Message.to(Message.SESSION, "setSyncing", false);
      this.setState({syncing: false});
    });

  }

}

export default withSplitPaneInfo(DashboardHeader);
