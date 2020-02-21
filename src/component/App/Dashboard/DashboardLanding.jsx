import React from 'react'
import Message from "../../../util/Message";
import Route from "../../../models/Route";

class DashboardLanding extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { localmode, selectedProject, selectedOrg, orgs, runs, projects, isSwitchingContext, user } = this.props;

    if (isSwitchingContext)
      return <div className="DashboardLanding grid-row v-align h-align">
        <div className="loader"></div>
      </div>;

    const otherProjects = projects.filter((project) => (!selectedProject || project.id !== selectedProject.id) && !project.archived ).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 );
    const otherOrgs = orgs.filter((org) => !selectedOrg || selectedOrg.id && org.id !== selectedOrg.id ).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 );
    const hasOtherProjects = otherProjects.length > 0;
    const hasOtherOrgs = otherOrgs.length > 0;
    const hasRuns = runs.length > 0;

    return (
      <div className="DashboardLanding grid-row v-align h-align">
        {localmode ? (
          <div className="floating-content">
            <div className="context-info">
              <img src={chrome.extension.getURL("assets/local.png")} />
            </div>
          </div>
        ) : selectedProject ? (
          <div className={"floating-content" + ((hasOtherProjects || hasRuns) ? " extra-content" : "")} >
            <div className="context-info org">
              <svg className="svg svg-project" viewBox="0 0 20 20"><path d="M13 2c0-.55-.45-1-1-1h-.78a1.98 1.98 0 0 0-3.44 0H7c-.55 0-1 .45-1 1v2h7V2z"/><path d="M16 2h-2v3H5V2H3c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h13c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"/></svg>
              <div className="context-name">{selectedProject.name} </div>
              <div className="context-name-sub">Project workspace</div>
              <button className="btn btn-with-icon" onClick={() => Message.promise("switchToOrg", {orgId: selectedOrg.id})}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 9H4.41L8.7 4.71c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71l-6 6c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l6 6a1.003 1.003 0 0 0 1.42-1.42L4.41 11H18c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
                Back to top-level workspace
              </button>
            </div>
            {(hasRuns) && (
              <div className="context-quickactions">
                <div className="quick-list">
                  <div className="action-label">Quick Runs:</div>
                  <div className="quick-list-cont">
                    {runs.map((run, idx) => (
                      <div key={idx} className="quick-list-item" onClick={(e) => this.executeRun(run) } >
                        <svg className="svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
                        {run.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : selectedOrg ? (
          <div className={"floating-content" + ((hasOtherProjects || hasRuns) ? " extra-content" : "")} >
            <div className="context-info org">
              <svg className="svg" viewBox="0 0 20 20"><g id="people_5_"><g id="_x32_0px"><path id="Combined-Shape_17_" d="M16.94 17c-.06-.33-.17-.69-.33-1.06-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15.02-.17.06-.34.11-.5.22-.74.68-1.4 1.29-1.86C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73c.62.46 1.07 1.13 1.29 1.86.05.17.09.33.11.5.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></g></g></svg>
              <div className="context-name">{selectedOrg.name} </div>
              <div className="context-name-sub">Top-level workspace</div>
              {selectedOrg.owner_id === user.id && (
                <div className="call-to-action">
                  <button className="btn assert-btn" onClick={() => Message.to(Message.SESSION, "setModal", "add-project")}>+ Project Workspace</button>
                  <button className="btn assert-btn" onClick={() => window.open(`https://www.snaptest.io/dashboard/org/${selectedOrg.id}/settings`, '_blank') } >+ Collaborator</button>
                </div>
              )}
              <button className="btn btn-with-icon" onClick={() => Message.promise("switchToCloud")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 9H4.41L8.7 4.71c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71l-6 6c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l6 6a1.003 1.003 0 0 0 1.42-1.42L4.41 11H18c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
                Back to personal cloud workspace.
              </button>
            </div>
            {(hasOtherProjects || hasRuns) && (
              <div className="context-quickactions">
                {projects.length > 0 && (
                  <div className="quick-list">
                    <div className="action-label">Project Worskpaces:</div>
                    <div className="quick-list-cont">
                      {otherProjects.filter((project) => (!selectedProject || selectedProject.id !== project.id)).map((project, idx) => (
                        <div key={idx} className="quick-list-item" onClick={(e) => Message.promise("switchToProject", {proId: project.id}) } >
                          <svg className="svg svg-project" viewBox="0 0 20 20"><path d="M13 2c0-.55-.45-1-1-1h-.78a1.98 1.98 0 0 0-3.44 0H7c-.55 0-1 .45-1 1v2h7V2z"/><path d="M16 2h-2v3H5V2H3c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h13c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"/></svg>
                          {project.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {hasRuns && (
                  <div className="quick-list">
                    <div className="action-label">Quick Runs:</div>
                    <div className="quick-list-cont">
                      {runs.map((run, idx) => (
                        <div key={idx} className="quick-list-item" onClick={(e) => this.executeRun(run) } >
                          <svg className="svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
                          {run.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={"floating-content" + ((hasOtherOrgs || hasRuns) ? " extra-content" : "")} >
            <div className="context-info">
              <svg className="svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 7c-.12 0-.24.03-.36.04C13.83 4.69 11.62 3 9 3 5.69 3 3 5.69 3 9c0 .05.01.09.01.14C1.28 9.58 0 11.13 0 13c0 2.21 1.79 4 4 4h11c2.76 0 5-2.24 5-5s-2.24-5-5-5z" id="cloud"/></svg>
              <div className="context-name">Personal Cloud Account</div>
            </div>
            {(hasOtherOrgs || hasRuns)&& (
              <div className="context-quickactions">
                {hasOtherOrgs && (
                  <div className="quick-list">
                    <div className="action-label">My Organizations:</div>
                    <div className="quick-list-cont">
                      {otherOrgs.map((org, idx) => (
                        <div key={idx} className="quick-list-item" onClick={(e) => Message.promise("switchToOrg", {orgId: org.id}) } >
                          <svg className="svg" viewBox="0 0 20 20"><g id="people_5_"><g id="_x32_0px"><path id="Combined-Shape_17_" d="M16.94 17c-.06-.33-.17-.69-.33-1.06-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15.02-.17.06-.34.11-.5.22-.74.68-1.4 1.29-1.86C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73c.62.46 1.07 1.13 1.29 1.86.05.17.09.33.11.5.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></g></g></svg>
                          {org.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {hasRuns > 0 && (
                  <div className="quick-list">
                    <div className="action-label">Quick Runs:</div>
                    <div className="quick-list-cont">
                      {runs.map((run, idx) => (
                        <div key={idx} className="quick-list-item" onClick={(e) => this.executeRun(run) } >
                          <svg className="svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
                          {run.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  executeRun(run) {
    if (confirm(`Execute Run "${run.name}"?`))
      Message.promise("pushRoute", {route: new Route("executerun", {runId: run.id})}).then(() => Message.promise("executeRun", {runId: run.id}))
  }

}

export default DashboardLanding;
