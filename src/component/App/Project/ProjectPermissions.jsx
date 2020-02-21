import React from 'react'
import _ from 'lodash'
import deepClone from 'deep-clone'
import CollaboratorDropdown from './CollaboratorDropdown'
import Message from '../../../util/Message'

class ProjectPermissions extends React.Component {

  constructor(props) {
    super(props);

    var permissions = this.hydratePerms(_.isObject(props.contextInfo.context.permissions) ? props.contextInfo.context.permissions : {viewers: [], editors: []}, props.collaborators);

    this.state = {
      originalPerms: deepClone(permissions),
      permissions: deepClone(permissions),
      newViewer: null,
      newEditor: null,
      dirty: false,
      saving: false
    }
  }

  render() {

    const { collaborators } = this.props;
    const { permissions, dirty, newViewer, newEditor, saving } = this.state;

    return (
      <div className="WorkspacePermissions">
        {permissions && (
          <div className="grid-row">
            <div className="grid-item grid-row grid-column perm-type">
              <div className="perm-title">Can view:</div>
              {permissions.viewers.length > 0 ? permissions.viewers.map((viewer) => (
                <div className="grid-row collab-row">
                  <div className="grid-item">
                    {viewer.email}
                  </div>
                  <div>
                    <a onClick={() => this.onRemove("viewers", viewer.user_id)}>Remove</a>
                  </div>
                </div>
              )) : (
                <div className="no-collabs">Anyone can view this project. </div>
              )}
              <div className="grid-row">
                <div className="grid-item">
                  <CollaboratorDropdown onSelect={(collab) => this.onAdd("viewers", collab)}
                                        collaborators={collaborators}
                                        placeholder="Add viewer..."
                                        excludeUsers={permissions.viewers.map((v) => v.user_id)}/>
                </div>
              </div>
            </div>
            <div className="grid-item grid-row grid-column perm-type">
              <div className="perm-title">Can edit:</div>
              {permissions.editors.length > 0 ? permissions.editors.map((editor) => (
                <div className="grid-row collab-row">
                  <div className="grid-item">
                    {editor.email}
                  </div>
                  <div>
                    <a onClick={() => this.onRemove("editors", editor.user_id)}>Remove</a>
                  </div>
                </div>
              )) : (
                <div className="no-collabs">Anyone can edit this project. </div>
              )}
              <div className="grid-row">
                <div className="grid-item">
                  <CollaboratorDropdown onSelect={(collab) => this.onAdd("editors", collab) }
                                        placeholder="Add editor..."
                                        collaborators={collaborators}
                                        excludeUsers={permissions.editors.map((v) => v.user_id)}/>
                </div>
              </div>
            </div>
          </div>
        )}
        {saving ? (
          <div className="perm-btn-group">
            <button className="btn btn-primary">Saving...</button>
            <button className="btn btn-secondary btn-disabled">Cancel</button>
          </div>
        ) : (
          <div className="perm-btn-group">
            <button className={"btn btn-primary" + (!dirty ? " btn-disabled" : "")} onClick={() => this.onSave()}>Save Changes</button>
            <button className={"btn btn-secondary"  + (!dirty ? " btn-disabled" : "")} onClick={() => this.onCancel()}>Reset</button>
          </div>
        )}
      </div>
    )
  }

  onSave() {

    const { contextInfo } = this.props;

    this.setState({saving: true});

    Message.promise("updatePermissions", {
      contextType: contextInfo.type,
      contextId: contextInfo.id,
      permissions: this.deHydratePerms()
    }).then(() => {
      this.setState({
        originalPerms: deepClone(this.state.permissions),
        dirty: false,
        saving: false
      });
    });

  }

  onAdd(role, collab) {
    var newPermissions = deepClone(this.state.permissions);

    if (newPermissions[role]) {
      var collabIdx = _.findIndex(newPermissions[role], {user_id: collab.user_id})

      if (collabIdx === -1) {
        newPermissions[role].push(collab);
        this.setState({ permissions: newPermissions, dirty: true });
      }

    }

  }

  onRemove(role, userId) {

    // find user in the role... delete if there.

    var newPermissions = deepClone(this.state.permissions);

    if (newPermissions[role]) {
      var collabIdx = _.findIndex(newPermissions[role], {user_id: userId})

      if (collabIdx !== -1) {
        newPermissions[role].splice(collabIdx, 1);

        this.setState({ permissions: newPermissions, dirty: true });

      }
    }

  }

  onCancel() {
    this.setState({ permissions: deepClone(this.state.originalPerms), dirty: false });
  }

  hydratePerms(permissions, collaborators) {
    
    var hydratedPermissions = {
      viewers: [],
      editors: []
    };

    if (_.isArray(permissions.viewers))
      permissions.viewers.forEach((viewer) => {
        var col = _.find(collaborators, {user_id: viewer});
        if (col) hydratedPermissions.viewers.push(col);
      });
    if (_.isArray(permissions.editors))
      permissions.editors.forEach((editor) => {
        var col = _.find(collaborators, {user_id: editor});
        if (col) hydratedPermissions.editors.push(col);
      });
    
    return hydratedPermissions;
    
  }

  deHydratePerms() {

    var dehydratedPermissions = deepClone(this.state.permissions);

    dehydratedPermissions.viewers = dehydratedPermissions.viewers.map((v) => v.user_id);
    dehydratedPermissions.editors = dehydratedPermissions.editors.map((v) => v.user_id);

    return dehydratedPermissions;
  }
  
}

export default ProjectPermissions;
