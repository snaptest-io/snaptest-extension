import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message'
import {Dropdown} from '../../../component'
import Route from '../../../models/Route'
import {getAccountType} from '../../../util/UserUtils'
import ProjectTree from '../Project/ProjectTree'

class AccountDropdown extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { localmode, selectedOrg, selectedProject, orgs, user, projects, projectGroups, expandedProjectGroups } = this.props;
    const mode = getAccountType(this.props);

    const dropdownArrow = (
      <div className="dd-arrow">
        <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 6c-.28 0-.53.11-.71.29L10 11.59l-5.29-5.3a1.003 1.003 0 0 0-1.42 1.42l6 6c.18.18.43.29.71.29s.53-.11.71-.29l6-6A1.003 1.003 0 0 0 16 6z" id="chevron_down_1_"/></svg>
      </div>
    );

    return (
      <Dropdown classNames="account-dd" button={
        <div className="account-dd-button grid-row v-align">
          {selectedOrg && (
            <div className="account">
              {selectedOrg.logo_url ? (
                <img src={selectedOrg.logo_url} />
              ) : (
                selectedOrg.name.substr(0, 2).toUpperCase()
              )}
            </div>
          )}
          {localmode ? (
            <div className="project">
              <div className="current grid-row v-align">
                <img src={chrome.extension.getURL("assets/local.png")} />
                <div className="grid-item">Local</div>
              </div>
              {dropdownArrow}
            </div>
          ) : selectedProject ? (
            <div className="project team org-project">
              <svg className="account-type-svg" viewBox="0 0 20 20"><g id="people_5_"><g id="_x32_0px"><path id="Combined-Shape_17_" d="M16.94 17c-.06-.33-.17-.69-.33-1.06-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15.02-.17.06-.34.11-.5.22-.74.68-1.4 1.29-1.86C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73c.62.46 1.07 1.13 1.29 1.86.05.17.09.33.11.5.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></g></g></svg>
              <div className="current">{selectedProject.name}</div>
              {dropdownArrow}
            </div>
          ) : selectedOrg ? (
            <div className="project team default-team-project">
              <svg className="account-type-svg" viewBox="0 0 20 20"><g id="people_5_"><g id="_x32_0px"><path id="Combined-Shape_17_" d="M16.94 17c-.06-.33-.17-.69-.33-1.06-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15.02-.17.06-.34.11-.5.22-.74.68-1.4 1.29-1.86C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73c.62.46 1.07 1.13 1.29 1.86.05.17.09.33.11.5.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></g></g></svg>
              <div className="current">{selectedOrg.name}</div>
              {dropdownArrow}
            </div>
          ) : (
            <div className="project">
              <div className="current grid-row v-align">
                <img src={chrome.extension.getURL("assets/cloud.png")} />
                <div className="grid-item">{user.email}</div>
              </div>
              {dropdownArrow}
            </div>
          )}
        </div>
      }>
        {selectedOrg && (
          <div>
            <div className="dd-header">Projects</div>
            <div className="projects-list">
              <div className="project-row root-project-row grid-row v-align">
                <div className="project-item grid-item grid-row team" onClick={(e) => this.onSwitchToProject()} >
                  <div className="grid-item">{selectedOrg.name}</div>
                  <div className="proj-type">(root)</div>
                </div>
                {/*<svg onClick={() => this.onOrgProjectSettingsClick()} className="svg-icon hoverable" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 8h-2.31c-.14-.46-.33-.89-.56-1.3l1.7-1.7a.996.996 0 0 0 0-1.41l-1.41-1.41a.996.996 0 0 0-1.41 0l-1.7 1.7c-.41-.22-.84-.41-1.3-.55V1c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2.33c-.48.14-.94.34-1.37.58L5 2.28a.972.972 0 0 0-1.36 0L2.28 3.64c-.37.38-.37.99 0 1.36L3.9 6.62c-.24.44-.44.89-.59 1.38H1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2.31c.14.46.33.89.56 1.3L2.17 15a.996.996 0 0 0 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l1.7-1.7c.41.22.84.41 1.3.55V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.33c.48-.14.94-.35 1.37-.59L15 17.72c.37.37.98.37 1.36 0l1.36-1.36c.37-.37.37-.98 0-1.36l-1.62-1.62c.24-.43.45-.89.6-1.38H19c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-9 6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" id="cog_2_"/></svg>*/}
              </div>
              <ProjectTree projects={projects}
                           projectGroups={projectGroups}
                           user={user}
                           expandedProjectGroups={expandedProjectGroups}
                           onOrgProjectSettingsClick={(projectId) => this.onOrgProjectSettingsClick(projectId) }
                           onSwitchToProject={(projectId) => this.onSwitchToProject(projectId)}/>
            </div>
            {selectedOrg && (
              <div className="dd-item" onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("manageprojects"))}>
                <svg className="svg build" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.43 16.67L9.31 7.81l1.47-1.56c.41-.44-.15-.8.15-1.6 1.08-2.76 4.19-2.99 4.19-2.99s.45-.47.87-.92C11.98-1 9.26.7 8.04 1.8L3.83 6.25l-.86.92c-.48.51-.48 1.33 0 1.84l-.87.92c-.48-.51-1.26-.51-1.74 0s-.48 1.33 0 1.84l1.74 1.84c.48.51 1.26.51 1.74 0s.48-1.33 0-1.84l.87-.92c.48.51 1.26.51 1.74 0l1.41-1.49 8.81 10.07c.76.76 2 .76 2.76 0 .76-.76.76-2 0-2.76z" id="Rectangle_1_11_"/></svg>
                Project Groups
              </div>)}
            <hr />
          </div>
        )}
        <div className="dd-header">Other Accounts</div>
        <div className="account-list">
          {(mode === "user") ? (null) : (user) ? (
            <div className="dd-item" onClick={(e) => Message.promise("switchToCloud")}>
              <img src={chrome.extension.getURL("assets/cloud.png")} />
              {user ? user.email : "Cloud"}
            </div>
          ) : (
            <div className="dd-item" onClick={(e) => Message.to(Message.SESSION, "pushRoute", new Route("auth"))}>
              <img src={chrome.extension.getURL("assets/cloud.png")} />
              <div className="grid-item">
                Cloud
              </div>
              <a href={""} onClick={(e) => e.preventDefault()}>Login</a>
            </div>
          )}
          {(mode !== "local") && (
            <div className={"dd-item"} onClick={() => this.onSetPrivateMode() }>
              <img src={chrome.extension.getURL("assets/local.png")} />
              Local
            </div>
          )}
          {orgs.filter((org) => (!selectedOrg || selectedOrg.id !== org.id)).map((org, idx) => (
            <div key={idx} className="dd-item" onClick={(e) => Message.promise("switchToOrg", {orgId: org.id}) } >
              <svg className="svg" viewBox="0 0 20 20"><g id="people_5_"><g id="_x32_0px"><path id="Combined-Shape_17_" d="M16.94 17c-.06-.33-.17-.69-.33-1.06-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15.02-.17.06-.34.11-.5.22-.74.68-1.4 1.29-1.86C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73c.62.46 1.07 1.13 1.29 1.86.05.17.09.33.11.5.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></g></g></svg>
              {org.name}
            </div>
          ))}
        </div>
        <hr />
        <div className="dd-header">Settings</div>
        <div className="dd-item" onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("projectsettings"))}>Project</div>
        {!localmode && (
          <div className="dd-item" onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("account"))}>User</div>
        )}
        <div className="dd-item" onClick={() => Message.to(Message.SESSION, "setModal", "support")}>Help</div>
        {!localmode  && ([
          <a className="dd-item" target="_blank" href="https://www.snaptest.io/dashboard/accounts">Accounts</a>,
          <div className="dd-item" onClick={() => this.onLogout()}>Logout</div>
        ])}
      </Dropdown>
    )
  }

  onSwitchToProject(proId) {

    const { selectedOrg } = this.props;

    if (!proId) {
      Message.promise("switchToOrg", {orgId: selectedOrg.id})
    } else {
      Message.promise("switchToProject", {proId});
    }

  }

  onOrgProjectSettingsClick(proId) {

    const { selectedOrg, selectedProject } = this.props;

    // switching to an orgs base project setting, but already in the base project.
    if ((!proId && !selectedProject) || (selectedProject && proId && proId === selectedProject.id)) {
      return Message.to(Message.SESSION, "pushRoute", new Route("projectsettings"))
    }

    // switching to an orgs base project, but in a different project
    if (!proId && selectedProject) {
      return Message
        .promise("switchToOrg", {orgId: selectedOrg.id})
        .then(() => Message.to(Message.SESSION, "pushRoute", new Route("projectsettings")))
    }

    return Message
      .promise("switchToProject", {proId: proId})
      .then(() => Message.to(Message.SESSION, "pushRoute", new Route("projectsettings")))
  }

  onLogout() {
    setTimeout(() => {Message.to(Message.SESSION, "logout") } , 16);
  }

  onSetPrivateMode() {
    Message.to(Message.SESSION, "setLocalMode");
    Message.to(Message.SESSION, "pushRoute", new Route("dashboard"))
  }

}



export default AccountDropdown;
