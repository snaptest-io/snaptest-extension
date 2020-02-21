import React from 'react'
import Message from '../../../util/Message'
import {Dropdown} from '../../../component'
import Route from '../../../models/Route'

class AccountDropdown extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { localmode, premium, orgs, projects, user, selectedOrg } = this.props;

    return (
      <Dropdown classNames="workspace-dd" button={
        <div className="workspace-button">
          <div className="workspace-label">
            <span className="current">Some project..</span>
            <img src={chrome.extension.getURL(`assets/${localmode ? "local" : "cloud"}.png`)} />
            <img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick.png")} />
          </div>
        </div>
      }>
        <div className="dd-header">Projects</div>
        {projects.map((project, idx) => (
          <div className="dd-item" onClick={(e) => Message.promise("switchToProject", {proId: project.id}) } >
            <img src={chrome.extension.getURL("assets/cloud.png")} />
            Project ({project.name})
          </div>
        ))}
        <div className="dd-item" onClick={() => this.onLogout()}>New Project</div>
      </Dropdown>
    )
  }

}



export default AccountDropdown;
