import React from 'react'
import _ from 'lodash'
import {getProjectGroupTree} from '../../../util/ProjectUtils'
import Message from '../../../util/Message'

class ProjectTree extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { projects, projectGroups, onSwitchToProject, onOrgProjectSettingsClick, expandedProjectGroups, user } = this.props;
    const projectTree = getProjectGroupTree(projectGroups, projects, expandedProjectGroups, user);

    const renderGroupNode = (node) => (
      <div className={node.id ? "project-tree" : ""}>
        {node.id && (
          <div className="grid-row project-group-header"
               onClick={(e) => this.onToggleGroupExpanded(node, e)}>
            <div>
              {node.expanded ? (
                <svg className="svg-icon hoverable" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 9H4c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" id="minus_6_"/></svg>
              ) : (
                <svg className="svg-icon hoverable " viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 9h-5V4c0-.55-.45-1-1-1s-1 .45-1 1v5H4c-.55 0-1 .45-1 1s.45 1 1 1h5v5c0 .55.45 1 1 1s1-.45 1-1v-5h5c.55 0 1-.45 1-1s-.45-1-1-1z" id="plus_11_"/></svg>
              )}
            </div>
            <div className="grid-item project-group-name">
              {node.name}
            </div>
          </div>
        )}
        {( node.expanded || node.level === 0) && (
          <div className="group-content">
            {node.children.map((child) => renderGroupNode(child))}
            <div className="projects">
              {node.projects.filter((project) => !project.archived).map((project, idx) => (
                <div className="project-row grid-row v-align" key={idx}>
                  <div className="project-item grid-item grid-row" onClick={(e) => onSwitchToProject(project.id)} >
                    <div className="grid-item proj-name">{project.name} {_.isNumber(project.tests) && (<span className="proj-test-count">({project.tests})</span>)}</div>
                    {project.viewOnly && (<div className="proj-type">(view only)</div>)}
                  </div>
                  {/*<svg onClick={() => onOrgProjectSettingsClick(project.id)} className="svg-icon hoverable" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 8h-2.31c-.14-.46-.33-.89-.56-1.3l1.7-1.7a.996.996 0 0 0 0-1.41l-1.41-1.41a.996.996 0 0 0-1.41 0l-1.7 1.7c-.41-.22-.84-.41-1.3-.55V1c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2.33c-.48.14-.94.34-1.37.58L5 2.28a.972.972 0 0 0-1.36 0L2.28 3.64c-.37.38-.37.99 0 1.36L3.9 6.62c-.24.44-.44.89-.59 1.38H1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2.31c.14.46.33.89.56 1.3L2.17 15a.996.996 0 0 0 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l1.7-1.7c.41.22.84.41 1.3.55V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.33c.48-.14.94-.35 1.37-.59L15 17.72c.37.37.98.37 1.36 0l1.36-1.36c.37-.37.37-.98 0-1.36l-1.62-1.62c.24-.43.45-.89.6-1.38H19c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-9 6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" id="cog_2_"/></svg>*/}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="">
        {renderGroupNode(projectTree)}
      </div>
    )
  }

  onToggleGroupExpanded(projectGroup, e) {
    e.stopPropagation();
    Message.promise("toggleExpandedProjectGroup", {projectGroupId: projectGroup.id})
  }

}

export default ProjectTree;
