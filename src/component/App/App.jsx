import React from 'react'
import _ from 'lodash'
import classNames from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Modal, GDPRBanner, SplitPane} from '../../component'
import NWTestRecorder from './Recorder/NWTestRecorder.jsx';
import RequestEditor from './Recorder/RequestEditor.jsx';
import NWCodeViewer from './Recorder/NWCodeViewer.jsx';
import AccountContent from './Account/AccountContent.jsx';
import ProjectSettings from './Project/ProjectSettings.jsx';
import ManageProjects from './Org/ManageProjects.jsx';
import Onboard from './Onboard/Onboard.jsx';
import Tutorial from './Onboard/Tutorial.jsx';
import SplashScreen from './Onboard/SplashScreen.jsx';
import DashboardHeader from './Dashboard/DashboardHeader.jsx';
import DashboardContent from './Dashboard/DashboardContent.jsx';
import DashboardLanding from './Dashboard/DashboardLanding.jsx';
import LiveOutput from './Recorder/LiveOutput.jsx';
import Message from '../../util/Message.js'
import MultiPlayback from './MultiPlayback/MultiPlayback.jsx';
import ExecuteRun from './MultiPlayback/ExecuteRun.jsx';
import DataProfiles from './DataProfiles/DataProfiles.jsx';
import TagsManage from './Tags/TagsManage.jsx';
import Runs from './Runs/Runs.jsx';
import Results from './Results/Results.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { user } = this.props;

    if (user) {
      Message.to(Message.SESSION, "updateUserData");
      Message.promise("getOrgs", { includeaccounts: true });
      Message.promise("getRuns");
      Message.promise("getTags");
    }

    this.debouncedOnWindowResize = _.debounce(this.onWindowResize, 100)

    window.addEventListener("resize", this.debouncedOnWindowResize);

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedOnWindowResize);
  }

  onWindowResize() {
    Message.to(Message.SESSION, "setWindowDimensions", {width: window.innerWidth})
  }

  render() {

    const { viewStack, user, tutorialActivated, liveoutput, splashActivated, selectedOrg, selectedProject, localmode, projectReadAccessDenied, orgs } = this.props;
    const currentRoute = viewStack[viewStack.length - 1];
    const lastRoute = viewStack[viewStack.length - 2] ? viewStack[viewStack.length - 2] : null;
    const viewProps = {...this.props, currentRoute, lastRoute, user };
    const mode = localmode ? "local-mode" : selectedOrg ? ( selectedProject ? "project-mode" : "org-mode") : "user-mode";

    const wrapperClasses = classNames({
      "full-height": true,
      "tutorial-active": tutorialActivated
    });

    return (
      <div className={wrapperClasses + " " + mode}>
        <Modal {...viewProps} />
        {user && user.agreedtoterms === 0 && (
          <GDPRBanner />
        )}
        {splashActivated && (
          <SplashScreen {...viewProps} />
        )}
        {tutorialActivated && (
          <Tutorial {...viewProps} />
        )}

        { projectReadAccessDenied ? (
          <div className="content">
            <DashboardHeader {...viewProps} noBorder showAccounts />
            <div className="grid-item grid-row h-align v-align full-height">
              <div className="EmptyState">
                <svg viewBox="0 0 20 20"><path id="lock_1_" d="M15.93 9H14V4.99c0-2.21-1.79-4-4-4s-4 1.79-4 4V9H3.93c-.55 0-.93.44-.93.99v8c0 .55.38 1.01.93 1.01h12c.55 0 1.07-.46 1.07-1.01v-8c0-.55-.52-.99-1.07-.99zM8 9V4.99c0-1.1.9-2 2-2s2 .9 2 2V9H8z"/></svg>
                <div className="ni-header">Project access denied</div>
              </div>
            </div>
          </div>
        ) : currentRoute.name === "auth" ? (
          <div className="content">
            <DashboardHeader {...viewProps} noBorder showSettings showMenu showAccounts />
            <Onboard {...viewProps} />
          </div>
        ) : currentRoute.name === "dashboard" ? (
          <SplitPane {...viewProps} section="tests"
                     singlePane={
                       <div className={"content " + currentRoute.name}>
                         <DashboardHeader {...viewProps} noBorder showAccounts showSettings showAutoSaveStatus showMenu section="tests" />
                         <DashboardContent {...viewProps} />
                       </div>
                     }
                     rightPane={<DashboardLanding {...viewProps} />} />
        ) : currentRoute.name === "codeviewer" ? (
          <div className="content">
            <DashboardHeader {...viewProps} showBackToDashboard showSettings />
            <NWCodeViewer {...viewProps} />
          </div>
        ) : currentRoute.name === "account" ? (
          <div className="content">
            <DashboardHeader {...viewProps} showAccounts showAutoSaveStatus showMenu />
            <AccountContent {...viewProps} />
          </div>
        ) : currentRoute.name === "projectsettings" ? (
          <div className="content">
            <DashboardHeader {...viewProps} showAccounts showBackToDashboard />
            <ProjectSettings {...viewProps} />
          </div>
        ) : currentRoute.name === "manageprojects" ? (
          <div className="content">
            <DashboardHeader {...viewProps} showAccounts showAutoSaveStatus showMenu />
            <ManageProjects {...viewProps} />
          </div>
        ) : currentRoute.name === "dataprofiles" ? (
          <SplitPane {...viewProps} section="environments"
                     singlePane={
                       <div className={"content " + currentRoute.name}>
                         <DashboardHeader {...viewProps} noBorder showAccounts showSettings showAutoSaveStatus showMenu section="environments"  />
                         <DataProfiles {...viewProps} />
                       </div>
                     }
                     rightPane={
                       <div className="content">
                         <DataProfiles {...viewProps} />
                       </div>
                     } />
        ) : currentRoute.name === "tags" ? (
          <SplitPane {...viewProps} section="tags"
                     singlePane={
                       <div className={"content " + currentRoute.name}>
                         <DashboardHeader {...viewProps} noBorder showAccounts showSettings showAutoSaveStatus showMenu section="tags"  />
                         <TagsManage {...viewProps} />
                       </div>
                     }
                     rightPane={
                       <div className="content">
                         <TagsManage {...viewProps} />
                       </div>
                     } />
        ) : currentRoute.name === "runs" ? (
          <SplitPane {...viewProps} section="runs"
                     singlePane={
                       <div className={"content " + currentRoute.name}>
                         <DashboardHeader {...viewProps} noBorder showAccounts showSettings showAutoSaveStatus showMenu section="runs" />
                         <Runs {...viewProps} />
                       </div>
                     }
                     rightPane={
                       <div className={"content " + currentRoute.name}>
                         <Runs {...viewProps} />
                       </div>
                     } />
        ) : currentRoute.name === "results" ? (
          <div className="content">
            <DashboardHeader {...viewProps} noBorder showAccounts showSettings showAutoSaveStatus showMenu section="results" />
            <Results {...viewProps} />
          </div>
        ) : (currentRoute.name === "testbuilder" || currentRoute.name === "testbuildercode") ? (
          <SplitPane {...viewProps} section="none"
                     singlePane={
                       <div className={"content " + currentRoute.name}>
                         <DashboardHeader {...viewProps} showEnvs showSettings noSpacing showTestHeader hideConfig/>
                         <NWTestRecorder {...viewProps} />
                         {(liveoutput && currentRoute.name === "testbuilder") && (<LiveOutput {...viewProps} />)}
                       </div>
                     }
                     rightPane={
                       <div className="content">
                         <DashboardHeader {...viewProps} showEnvs showSettings showTestHeader hideBackButton isMultiPane hideConfig/>
                         <NWTestRecorder {...viewProps} />
                         {(liveoutput && currentRoute.name === "testbuilder") && (<LiveOutput {...viewProps} />)}
                       </div>
                     } />
        ) : (currentRoute.name === "requestbuilder") ? (
          <SplitPane {...viewProps} section="tests"
                     singlePane={
                       <div className={"content " + currentRoute.name}>
                         <DashboardHeader {...viewProps} showEnvs showSettings hideConfig />
                         <RequestEditor {...viewProps} />
                       </div>
                     }
                     rightPane={
                       <div className="content">
                         <DashboardHeader {...viewProps} showEnvs showSettings showTestHeader hideBackButton hideConfig />
                         <RequestEditor {...viewProps} />
                       </div>
                     } />
        ) : currentRoute.name === "componentbuilder" ? (
          <SplitPane {...viewProps} section="none"
                     singlePane={
                       <div className={"content is-component " + currentRoute.name}>
                         <DashboardHeader {...viewProps} showEnvs showSettings showTestHeader hideConfig />
                         <NWTestRecorder {...viewProps} />
                       </div>
                     }
                     rightPane={
                       <div className="content is-component">
                         <DashboardHeader {...viewProps} showEnvs showSettings showTestHeader hideBackButton hideConfig />
                         <NWTestRecorder {...viewProps} />
                       </div>
                     } />
        ) : currentRoute.name === "multiplayback" ? (
          <SplitPane {...viewProps} section="tests"
                     singlePane={
                       <div className={"content " + currentRoute.name}>
                         <DashboardHeader {...viewProps} showEnvs showSettings showMenu />
                         <MultiPlayback {...viewProps} />
                       </div>
                     }
                     rightPane={
                       <div className={"content " + currentRoute.name}>
                         <DashboardHeader {...viewProps} showEnvs showSettings hideBackButton />
                         <MultiPlayback {...viewProps} />
                       </div>
                     } />
        ) : currentRoute.name === "patchrun" ? (
          <div className="content">
            <DashboardHeader {...viewProps} showMenu />
            <MultiPlayback {...viewProps} />
          </div>
        ) : currentRoute.name === "executerun" ? (
          <div className="content">
            <DashboardHeader {...viewProps} disableBack={true}/>
            <ExecuteRun {...viewProps} />
          </div>
        ) : (
          <div className="content">
            <DashboardHeader {...viewProps} />
          </div>
        )}
      </div>
    )
  }


}

export default DragDropContext(HTML5Backend)(App);