import _ from 'lodash'

export function getProjectGroupTree(_projectGroups, projects, expandedGroups, user) {

  var root = {
    id: null,
    name: null,
    projects: [],
    children: []
  };

  var projectGroups = _projectGroups.map((pG) => {
    if (!_.find(_projectGroups, {id: pG.parent}) || pG.parent === -1) {
      return { ... pG, parent: null }
    } else return pG;
  }).sort((a, b) => a.name > b.name ? 1 : -1);

  function buildChildren(node, groups) {
    node.children = groups.filter((group) => group.parent === node.id);
    node.type = "projectGroup";
    // root group case:
    if (node.id === null) {

      node.projects = projects.filter((project) => {
        if (project.project_group === null || project.project_group === -1) {
          return true;
        } else {
          var groupExists = _.find(groups, {id: project.project_group});
          return !groupExists;
        }
      }).filter((project) => hasViewAccessFilter(project, user))
        .map((project) => !hasEditAccessFilter(project, user) ? {...project, viewOnly: true} : {...project, viewOnly: false })
        .sort((a, b) => a.name > b.name ? 1 : -1);

    }
    // non-root case:
    else {
      node.projects = projects
        .filter((project) => project.project_group === node.id)
        .filter((project) => hasViewAccessFilter(project, user))
        .map((project) => !hasEditAccessFilter(project, user) ? {...project, viewOnly: true} : {...project, viewOnly: false })
        .sort((a, b) => a.name > b.name ? 1 : -1);
    }

    node.expanded = node.id === null || expandedGroups.indexOf(node.id) !== -1;
    node.children.forEach((child) => { buildChildren(child, groups); });
  }

  buildChildren(root, projectGroups);

  return root;

}

function hasViewAccessFilter(project, user) {
  if (user && project.permissions) {
    if (project.permissions.viewers.length === 0) return true;
    else return project.permissions.viewers.indexOf(user.id) !== -1;
  } else return true
}

function hasEditAccessFilter(project, user) {
  if (user && project.permissions) {
    if (project.permissions.editors.length === 0) return true;
    else return project.permissions.editors.indexOf(user.id) !== -1;
  } else return true
}

export function isNodeWithinNode(targetNode, withinNode) {

  // is source node within target node?

  var isWithin = false;

  function checkChildren(node) {
    if (_.find(node.children, {id: targetNode.id})) isWithin = true;
    node.children.forEach((child) => {
      checkChildren(child);
    });
  }

  checkChildren(withinNode);

  return isWithin;

}
