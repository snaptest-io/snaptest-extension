import React from 'react'
import ClassNames from 'classnames'
import _ from 'lodash'
import Message from '../../../util/Message'
import {EditableLabel} from '../../'
import ProjectPermissions from './ProjectPermissions'
import {getCurrentContextInfo} from "../../../util/ContextUtils";
import ArchivedTestList from "./ArchivedTestList/ArchivedTestList";

class AccountContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      copyAllToPrivateSuccess: false,
      loading: false,
      activeSubmenu: 'options',
      loadingSection: false
    };

    this.debouncedOnChangeAttrName = _.debounce(this.onChangeAttrName, 500, {leading: false})

  }

  componentDidMount() {

    Message.promise("getSettings");
    Message.promise("getArchivedTests");

    this.getAllSettingsData();

  }

  componentDidUpdate(nextProps) {
    if (!this.props.isSwitchingContext && nextProps.isSwitchingContext) {

      const contextTabs = {
        local: ['options'],
        user: ['options', 'archives'],
        org: ['options', 'archives', 'perms', 'collabs'],
        project: ['options', 'archives', 'perms']
      };

      const contextInfo = getCurrentContextInfo(nextProps);
      const allowedTabs = contextTabs[contextInfo.type];

      if (allowedTabs.indexOf(this.state.activeSubmenu) === -1) {
        this.setState({activeSubmenu: "options"});
        this.getSectionData("options");
      } else {
        this.getSectionData(this.state.activeSubmenu);
      }

    }
  }

  getSectionData(section) {
    if (section === "options") this.getOptionsData();
    else if (section === "perms") this.getPermissionsData();
    else if (section === "archives") this.getArchiveData();
  }

  getOptionsData(hideLoader) {

    if (!hideLoader)
      this.setState({loadingSection: true});

    const contextInfo = getCurrentContextInfo(this.props);

    Promise.all([
      Message.promise("getSettings")
    ]).then(() => {
      this.setState({loadingSection: false});
    });

  }

  getPermissionsData(hideLoader) {

    if (!hideLoader)
      this.setState({loadingSection: true});

    const contextInfo = getCurrentContextInfo(this.props);

    Promise.all([
      Message.promise(contextInfo.isOrg ? "getCurrentOrg": "getCurrentProject"),
      Message.promise("getCollaborators"),
    ]).then(() => {
      this.setState({loadingSection: false});
    });

  }

  getArchiveData(hideLoader) {

    if (!hideLoader)
      this.setState({loadingSection: true});

    Message.promise("getArchivedTests").then(() => {
      this.setState({loadingSection: false});
    })

  }

  getAllSettingsData() {

    const contextInfo = getCurrentContextInfo(this.props);

    if (contextInfo.isProject) {

      this.setState({loading: true});

      Promise.all([
        Message.promise("getCurrentProject"),
        Message.promise("getCollaborators"),
        Message.promise("getArchivedTests")
      ]).then(() => {
        this.setState({loading: false});
      })

    } else if (contextInfo.isOrg) {

      this.setState({loading: true});

      Promise.all([
        Message.promise("getCurrentOrg"),
        Message.promise("getCollaborators"),
        Message.promise("getArchivedTests")
      ]).then(() => {
        this.setState({loading: false});
      })
    }
    else if (!contextInfo.isLocal) {
      Promise.all([
        Message.promise("getArchivedTests")
      ]).then(() => {
        this.setState({loading: false});
      })
    }


  }

  render() {

    const { premium, userSettings, isSwitchingContext, archivedTests, directory, localmode} = this.props;
    const { loading, activeSubmenu, loadingSection } = this.state;
    const contextInfo = getCurrentContextInfo(this.props);

    if (isSwitchingContext || loading) return <div className="content-loading"><div className="loader"></div></div>;

    return (
      <div className="settings-content">
        <div className="settings-title">
          Project Settings
        </div>
        {contextInfo.isProject ? (
          <div className="account-section">
            <div className="orgtype-header">Project:</div>
            <div className="grid-row v-align project-label">
              <EditableLabel value={contextInfo.context.name}
                             size={contextInfo.context.name.length}
                             onChange={(name) => Message.promise("patchProject", {proId: contextInfo.context.id, patch: {name}}).then(() => Message.promise("getProjects"))}/>
            </div>
          </div>
        ) : contextInfo.isOrg ? (
          <div className="account-section">
            <div className="orgtype-header">Organization:</div>
            <div className="grid-row v-align project-label">
              {contextInfo.context.name}
            </div>
          </div>
        ) : (
          <div className="account-section">
            <div className="grid-row v-align project-label">
              {premium ? (
                "Personal Premium Project"
              )  : (
                "Personal Basic Project"
              )}
            </div>
            <div className="grid-row v-align">
              <a href="https://www.snaptest.io/dashboard/accounts" target="_blank">
                {premium ? (
                  "Manage your subscription in the dashboard."
                ) :
                  "Upgrade to a premium account in the dashboard."
                }
              </a>
            </div>
          </div>
        )}
        <div className="project-submenu">
          <div className={ClassNames("project-submenu-item", {active: activeSubmenu === "options" })}
               onClick={() => {
                 this.setState({activeSubmenu: "options"});
                 this.getOptionsData();
               }}>
            Options
          </div>
          {(contextInfo.isProject || contextInfo.isOrg ) && (
            <div className={ClassNames("project-submenu-item", { active: activeSubmenu === "perms" })}
                 onClick={() => {
                   this.setState({activeSubmenu: "perms"});
                   this.getPermissionsData();
                 }}>
              Permissions
            </div>
          )}
          {contextInfo.isOrg && (
            <div className={ClassNames("project-submenu-item", { active: activeSubmenu === "collabs" })}
                 onClick={() => {
                   this.setState({activeSubmenu: "collabs"});
                 }}>
              Collaborators
            </div>
          )}
          {!localmode && (
            <div className={ClassNames("project-submenu-item", { active: activeSubmenu === "archives" })}
                 onClick={() => {
                   this.setState({activeSubmenu: "archives"});
                   this.getArchiveData();
                 }}>
              Archives
            </div>
          )}
        </div>

        {loadingSection ? (
          <div className="account-section">
            <div className="loader"></div>
          </div>
        ) : activeSubmenu === "options" ? (
          <div className="account-section">
            <div className="account-header">Project options:</div>
            <div className="account-row grid-row v-align">
              <div className="setting-label">
                Drafts:
              </div>
              <div className="radio-toggle">
                <label className="grid-row v-align">
                  <input type="radio" value="off" name="drafts" checked={!userSettings.drafts} onChange={(e) => this.onDraftChange(e) }/>
                  Off
                </label>
                <label className="grid-row v-align">
                  <input type="radio" value="on" name="drafts" checked={userSettings.drafts} onChange={(e) => this.onDraftChange(e) }/>
                  On
                </label>
              </div>
            </div>
            <div className="account-row grid-row v-align">
              <div className="setting-label">
                Global timeout
              </div>
              <div className="radio-toggle">
                <label className="grid-row v-align">
                  <input type="number"
                         className="text-input"
                         value={userSettings.globalTimeout}
                         name="globaltimeout"
                         onChange={(e) => Message.promise("setSetting", {key: "globalTimeout", value: parseInt(e.currentTarget.value)})}/>
                </label>
              </div>
            </div>
            <div className="account-row grid-row v-align">
              <div className="setting-label">
                Auto-describe:
              </div>
              <div className="radio-toggle">
                <label className="grid-row v-align">
                  <input type="radio" value="off" name="autodescribe" checked={!userSettings.autodescribe} onChange={(e) => Message.promise("setSetting", {key: "autodescribe", value: e.currentTarget.value === "on"}) }/>
                  Off
                </label>
                <label className="grid-row v-align">
                  <input type="radio" value="on" name="autodescribe" checked={userSettings.autodescribe} onChange={(e) => Message.promise("setSetting", {key: "autodescribe", value: e.currentTarget.value === "on"}) }/>
                  On
                </label>
              </div>
            </div>
            <div className="account-row grid-row v-align">
              <div className="setting-label">
                Warnings:
              </div>
              <div className="radio-toggle">
                <label className="grid-row v-align">
                  <input type="radio" value="off" name="warnings" checked={!userSettings.warnings} onChange={(e) => Message.promise("setSetting", {key: "warnings", value: e.currentTarget.value === "on"}) }/>
                  Off
                </label>
                <label className="grid-row v-align">
                  <input type="radio" value="on" name="warnings" checked={userSettings.warnings} onChange={(e) => Message.promise("setSetting", {key: "warnings", value: e.currentTarget.value === "on"}) }/>
                  On
                </label>
              </div>
            </div>
            <div className="account-row grid-row v-align">
              <div className="setting-label">
                Show Action #s:
              </div>
              <div className="radio-toggle">
                <label className="grid-row v-align">
                  <input type="radio" value="off" name="actionNumbers" checked={!userSettings.actionNumbers} onChange={(e) => Message.promise("setSetting", {key: "actionNumbers", value: e.currentTarget.value === "on"})  }/>
                  Off
                </label>
                <label className="grid-row v-align">
                  <input type="radio" value="on" name="actionNumbers" checked={userSettings.actionNumbers} onChange={(e) => Message.promise("setSetting", {key: "actionNumbers", value: e.currentTarget.value === "on"}) }/>
                  On
                </label>
              </div>
            </div>
            {(userSettings.selectorPriority && userSettings.selectorPriority.length > 0) && (
              <div className="account-row grid-row">
                <div className="setting-label">
                  <div>Selector Priority:</div>
                  <div>
                    <a target="_blank" href="https://www.snaptest.io/doc/selector-strategies">See more details.</a>
                  </div>
                </div>
                <div className="selector-priority-table grid-item">
                  {userSettings.selectorPriority.map((selector, idx) => (
                    <div key={idx} className="selector">
                      <div>
                        <input type="checkbox" checked={selector.enabled} onChange={(e) => this.onToggleSelector(idx, e)} />
                      </div>
                      <a className="s-promote" onClick={() => this.onPromoteSelector(idx)}>
                        <img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick.png")} />
                      </a>
                      <a className="s-demote" onClick={() => this.onDemoteSelector(idx)}>
                        <img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick.png")} />
                      </a>
                      <div className="s-type value-type">
                        {selector.type}
                      </div>
                      {_.isString(selector.name) && (
                        <div className="grid-item custom-attr">
                          <div className="grid-row custom-value">
                            <div className="">
                              <input type="text" className="text-input" value={selector.name} onChange={(e) => this.debouncedOnChangeAttrName(e, idx)} placeholder="attribute name"/>
                            </div>
                            <div className="grid-item"></div>
                            <a onClick={(e) => {e.preventDefault(); this.onRemoveSelector(idx)}} href="">remove</a>
                          </div>
                          <label className="grid-row v-align">
                            <input type="checkbox"
                                   checked={selector.ancestor}
                                   onChange={(e) => this.onChangeAncestor(e, idx)} placeholder="attribute name"/>
                            <span>Check ancestors... </span>
                            <a target="_blank" href="https://www.snaptest.io/doc/selector-strategies#checkancestor">What's this?</a>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                  <div>
                    <a href="" onClick={(e) => this.onAddSelector(e)}>+ Add Attribute Selector</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeSubmenu === "perms" ? (
          <div className="account-section">
            <div className="account-header">Project Permissions:</div>
            <ProjectPermissions {...this.props} contextInfo={contextInfo} hasLoaded={!isSwitchingContext} />
          </div>
        ) : activeSubmenu === "archives" ? (
          <div className="account-section archives">
            {archivedTests.length > 0 ? (
                <div>
                  <div className="account-header">Archived Tests:</div>
                  <ArchivedTestList tests={archivedTests} directory={directory} />
                </div>
              ) : (
                <div className="grid-item grid-row grid-column v-align h-align">
                  <h4>Nothing archived.</h4>
                </div>
              )}
          </div>
        ) : activeSubmenu === "collabs" ? (
          <div className="account-section">
            <a href="https://www.snaptest.io/dashboard/accounts" target="_blank">Manage collaborators on your dashboard.</a>
          </div>
        ) : null}

      </div>
    )
  }

  onToggleSelector(idx, e) {
    var {selectorPriority} = this.props.userSettings;
    selectorPriority[idx].enabled = e.currentTarget.checked;
    Message.promise("setSetting", {key: "selectorPriority", value: selectorPriority});
  }

  onRemoveSelector(idx) {
    var {selectorPriority} = this.props.userSettings;
    selectorPriority.splice(idx, 1);
    Message.promise("setSetting", {key: "selectorPriority", value: selectorPriority});
  }

  onPromoteSelector(idx) {

    var {selectorPriority} = this.props.userSettings;
    var currentIdx = idx;
    var targetIdx = idx - 1;

    if (targetIdx !== -1) {

      var selectorToSwap = selectorPriority[targetIdx];
      selectorPriority[targetIdx] = selectorPriority[currentIdx];
      selectorPriority[currentIdx] = selectorToSwap;
      Message.promise("setSetting", {key: "selectorPriority", value: selectorPriority});
    }

  }

  onDemoteSelector(idx) {

    var {selectorPriority} = this.props.userSettings;
    var currentIdx = idx;
    var targetIdx = idx + 1;

    if (targetIdx < selectorPriority.length) {

      var selectorToSwap = selectorPriority[targetIdx];
      selectorPriority[targetIdx] = selectorPriority[currentIdx];
      selectorPriority[currentIdx] = selectorToSwap;

      Message.promise("setSetting", {key: "selectorPriority", value: selectorPriority});
    }

  }

  onChangeAttrName(e, idx) {
    var {selectorPriority} = this.props.userSettings;
    selectorPriority[idx].name = e.currentTarget.value;
    Message.promise("setSetting", {key: "selectorPriority", value: selectorPriority});
  }

  onChangeAncestor(e, idx) {
    var {selectorPriority} = this.props.userSettings;
    selectorPriority[idx].ancestor = e.currentTarget.checked;
    Message.promise("setSetting", {key: "selectorPriority", value: selectorPriority});
  }

  onAddSelector(e) {
    var {selectorPriority} = this.props.userSettings;
    e.preventDefault();
    selectorPriority.unshift({type: "attr", name:"", enabled: true});
    Message.promise("setSetting", {key: "selectorPriority", value: selectorPriority});
  }

  onDraftChange(e) {
    Message.promise("setSetting", {key: "drafts", value: e.currentTarget.value === "on"});
  }

}

export default AccountContent;
