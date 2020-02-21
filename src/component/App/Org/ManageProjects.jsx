import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message'
import {getProjectGroupTree} from '../../../util/ProjectUtils'
import {EditableLabel} from '../../'
import ProjectOptionsDropdown from '../Project/ProjectOptionsDropdown'

class ManageProjects extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      copyAllToPrivateSuccess: false
    }

  }

  componentDidMount() {
    Message.promise("getProjectsAndGroups");
  }

  render() {

    const { projectGroups, projects, expandedProjectGroups, user } = this.props;

    const groupTree = getProjectGroupTree(projectGroups, projects, expandedProjectGroups, user);

    const renderGroupNode = (node) => (
      <div className={node.id ? "project-group" : ""}>
        {node.id && (
          <div className="project-group-header grid-row"
               onClick={() => this.onToggleGroupExpanded(node)}>
            <div>
              {node.expanded ? (
                <svg className="svg-icon hoverable" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 9H4c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" id="minus_6_"/></svg>
              ) : (
                <svg className="svg-icon hoverable " viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 9h-5V4c0-.55-.45-1-1-1s-1 .45-1 1v5H4c-.55 0-1 .45-1 1s.45 1 1 1h5v5c0 .55.45 1 1 1s1-.45 1-1v-5h5c.55 0 1-.45 1-1s-.45-1-1-1z" id="plus_11_"/></svg>
              )}
            </div>
            <div className="square">Project Group</div>
            <div className="grid-item project-group-name">
              <EditableLabel value={node.name}
                             size={node.name.length}
                             onChange={(newName) => this.onProjectGroupNameChange(node.id, newName)}/>
            </div>
            <div className="move-project" onClick={(e) => e.stopPropagation()}>
              <ProjectOptionsDropdown {...this.props} button={<a>Move</a>} node={node} />
            </div>
          </div>
        )}
        {(node.expanded || node.level === 0)&& (
          <div className="group-content">
            {node.children.map((child) => renderGroupNode(child))}
            <div className="projects">
              {node.projects.filter((project) => !project.archived).map((project, idx) => (
                <div className="block-list-item project-block-item" key={idx}>
                  <div className="grid-row v-align">
                    <div className="square">Project</div>
                    <div className="grid-item project-name grid-row v-align">
                      <EditableLabel value={project.name}
                                     size={project.name.length}
                                     onChange={(newName) => this.onProjectNameChange(project.id, newName)}/>
                    </div>
                    <div className="move-project">
                      <ProjectOptionsDropdown {...this.props} button={<a>Move</a>} node={project} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="manage-projects">
        <div className="header-row grid-row">
          <h4 className="grid-item">Projects</h4>
          <div className="grid-row v-align">
            <button className="btn recording-btn"
                    onClick={() => this.onNewProject()}>+ Add project</button>
            <button className="btn assert-btn"
                    onClick={() => this.onNewProjectGroup()}>+ Add Group</button>
          </div>
        </div>
        <div className="block-list">
          {renderGroupNode(groupTree)}
          {projects.filter((project) => project.archived).map((project, idx) => (
            <div className="block-list-item project-block-item project-archived" key={idx}>
              <div className="grid-row v-align">
                <div className="square">Archived Project</div>
                <div className="grid-item project-name grid-row v-align">
                  <EditableLabel value={project.name}
                                 size={project.name.length}
                                 onChange={(newName) => this.onProjectNameChange(project.id, newName)}/>
                </div>
                <div className="archive">
                  <a onClick={() => this.onUnarchiveProject(project.id)}>un-archive</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  onToggleGroupExpanded(projectGroup) {
    Message.promise("toggleExpandedProjectGroup", {projectGroupId: projectGroup.id})
  }

  onProjectNameChange(proId, name) {
    Message.promise("patchProject", {proId, patch: {name}}).then(() => Message.promise("getProjects"));
  }

  onProjectGroupNameChange(projectGroupId, name) {
    Message.promise("patchProjectGroup", {projectGroupId, patch: {name}}).then(() => Message.promise("getProjectsAndGroups"));
  }

  onNewProject() {
    Message.to(Message.SESSION, "setModal", "add-project");
  }

  onNewProjectGroup() {
    Message.to(Message.SESSION, "setModal", "add-project-group");
  }

  onUnarchiveProject(proId) {
    Message.promise("unarchiveProject", {proId, name}).then(() => Message.promise("getProjects"));
  }

}

export default ManageProjects;
