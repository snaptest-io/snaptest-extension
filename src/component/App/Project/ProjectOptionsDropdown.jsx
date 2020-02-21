import React from 'react'
import {Dropdown} from '../../../component'
import Message from '../../../util/Message'
import {isNodeWithinNode} from '../../../util/ProjectUtils'

class ProjectOptionsDropdown extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { user, projectGroups = [], button, node } = this.props;

    return (
      <Dropdown classNames="quick-buttons quick-button-dd quick-button-left"
                button={<button className={"btn btn-empty"}>edit<img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick.png")} /></button>}>
        <div>
          <div className="dd-header">Move to group:</div>
          {projectGroups.filter((pG) => node.type !== "projectGroup" || node.id !== pG.id).map((projectGroup) => (
            <div className="dd-item" onClick={(e) => {this.onMoveToGroup(projectGroup)}} >
              <div className="square">Project Group</div>
              {projectGroup.name}
            </div>
          ))}
          <div className="dd-item" onClick={(e) => {this.onMoveToGroup()}}>
            Remove from groups
          </div>
        </div>
        <hr />
        <div className="dd-header">delete</div>
        {node.type === "projectGroup" ? (
          <div className="dd-item dd-warn" onClick={() => this.onRemoveGroup()}>
            remove
          </div>
        ) : (
          <div className="dd-item dd-warn" onClick={() => this.onArchiveProject()}>
            archive
          </div>
        )}
      </Dropdown>
    )
  }

  onMoveToGroup(projectGroup) {

    const { node } = this.props;

    if (node.type === "projectGroup") {

      // need to make sure this group is not within itself...
      if (projectGroup && isNodeWithinNode(projectGroup, node)) return;

      Message.promise("patchProjectGroup", {projectGroupId: node.id, patch: { parent: projectGroup ? projectGroup.id : -1 }})
        .then(() => Message.promise("getProjectsAndGroups"))
        .then(() => this.setState({processing: false, success: true}))
        .catch((e) => this.setState({processing: false, success: false, error: e}))
    } else {
      Message.promise("patchProject", {proId: node.id, patch: { project_group: projectGroup ? projectGroup.id : -1 }})
        .then(() => Message.promise("getProjectsAndGroups"))
        .then(() => this.setState({processing: false, success: true}))
        .catch((e) => this.setState({processing: false, success: false, error: e}))
    }

  }

  onArchiveProject() {
    const { node } = this.props;

    if (node.type !== "projectGroup" && confirm("Are you sure you want to archive this project?")) {
      Message.promise("archiveProject", {proId: node.id}).then(() => Message.promise("getProjects"));
    }
  }

  onRemoveGroup() {

    const { node } = this.props;

    if (node.type === "projectGroup" && confirm("Are you sure you want to remove this project group?")) {
      Message.promise("deleteProjectGroup", {projectGroupId: node.id}).then(() => Message.promise("getProjectsAndGroups"));
    }
  }

}

export default ProjectOptionsDropdown;
