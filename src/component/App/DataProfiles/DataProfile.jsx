import React from 'react'
import {EditableLabel, EnvVariable, Variable} from "../../index";
import MoveEnvDropdown from "./MoveEnvDropdown/MoveEnvDropdown";
import ReactTooltip from 'simple-react-tooltip'
import Message from "../../../util/Message";
import deepClone from 'deep-clone'
import _ from 'lodash'
import {StringVariable, EnvVariable as EnvVarModel} from "../../../models/Variable";
import {autoSave} from "../../../util/statePersistance";

class DataProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isDirty: false,
      tmpVariables: deepClone(props.profile.variables),
      profileId: props.profile.id
    };

  }

  resetState() {

    const { profile } = this.props;

    this.setState({
      isDirty: false,
      tmpVariables: deepClone(profile.variables),
      profileId: profile.id
    });

  }

  render() {

    const { closedProfiles, dataProfiles, profile, idx } = this.props;
    const { isDirty, tmpVariables, profileId } = this.state;

    if (profileId !== profile.id) this.resetState();

    return (
      <div className="DataProfile" idx={idx}>
        <div className={"profile" + (profile.inherited ? " inherited" : "")}>
          <div className="grid-row v-align profile-header">
            {closedProfiles.indexOf(profile.id) === -1 ? (
              <svg onClick={(e) => this.onToggle(profile)} className="svg-icon hoverable expand" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.71 12.29l-6-6C10.53 6.11 10.28 6 10 6s-.53.11-.71.29l-6 6a1.003 1.003 0 0 0 1.42 1.42L10 8.41l5.29 5.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71z" id="chevron_up_1_"/></svg>
            ) : (
              <svg onClick={(e) => this.onToggle(profile)} className="svg-icon hoverable expand" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 6c-.28 0-.53.11-.71.29L10 11.59l-5.29-5.3a1.003 1.003 0 0 0-1.42 1.42l6 6c.18.18.43.29.71.29s.53-.11.71-.29l6-6A1.003 1.003 0 0 0 16 6z" id="chevron_down_1_"/></svg>
            )}
            <div className="grid-item grid-row v-align">
              <div className="env">{profile.inherited && ("(Inherited) ")}Env:</div>
              <EditableLabel value={profile.name}
                             doubleClickEdit={false}
                             onClick={() => this.onToggle(profile)}
                             size={profile.name.length}
                             showEditButton={!profile.inherited}
                             onChange={(newName) => this.onProfileNameChange(profile, newName)}/>
            </div>
            {!profile.inherited ? (
              <div className="grid-row v-align">
                <MoveEnvDropdown {...this.props} profile={profile}/>
                <button className="quick-button"
                        title="Delete folder"
                        onMouseDown={this.stopPropagation}
                        onClick={(e) => this.onProfileRemove(profile)}
                        data-tip="Delete environment"
                        data-for="profile-tip">
                  <img src={chrome.extension.getURL("assets/trash.png")} />
                </button>
              </div>
            ) : (
              <div className="grid-row v-align">
                <svg viewBox="0 0 20 20" className="svg-icon svg-icon-lock" data-tip="Editing is locked on inherited environments." data-for="locked-tooltip">
                  <path id="lock_1_" d="M15.93,9H14V4.99c0-2.21-1.79-4-4-4s-4,1.79-4,4V9H3.93C3.38,9,3,9.44,3,9.99v8C3,18.54,3.38,19,3.93,19h12
              c0.55,0,1.07-0.46,1.07-1.01v-8C17,9.44,16.48,9,15.93,9z M8,9V4.99c0-1.1,0.9-2,2-2s2,0.9,2,2V9H8z"/>
                </svg>
                <ReactTooltip id="locked-tooltip" place="top" type="dark" effect="solid" />
              </div>
            )}
          </div>
          <ReactTooltip id="profile-tip" place="top" type="dark" effect="solid" />
          {closedProfiles.indexOf(profile.id) === -1 && (
            <div className="profile-body">
              {!profile.inherited && (
                <div className="add-row">
                  <a onClick={() => this.onVarAdd(profile)}>+ Add String Var</a>
                  <a onClick={() => this.onVarAdd(profile, "ENV_VAR")}>+ Extend with Env</a>
                  {!profile.hidden ? (
                    <a onClick={() => this.onSetHidden(profile, true)}>+ Visible</a>
                  ) : (
                    <a onClick={() => this.onSetHidden(profile, false)}>+ Hidden</a>
                  )}
                </div>
              )}
              {tmpVariables.length > 0 && (
                <div className="variables">
                  {tmpVariables.map((variable, idx) => (
                    <div idx={idx} className="var-cont">
                      {variable.type === "ENV_VAR" && (
                        <EnvVariable environments={dataProfiles}
                                     variable={variable}
                                     prefix="Extend: "
                                     deleteDisabled={profile.inherited}
                                     editDisabled={profile.inherited}
                                     ignoreEnvs={[profile.id]}
                                     onValueChange={(newValue) => this.onVarValueChange(profile, variable.id, newValue)}
                                     onDelete={() => this.onVarDelete(profile, variable.id)} />
                      )}
                      {variable.type === "STRING_VAR" && (
                        <Variable name={variable.name}
                                  value={variable.defaultValue}
                                  deleteDisabled={profile.inherited}
                                  editDisabled={profile.inherited}
                                  onNameChange={(newName) => this.onVarNameChange(profile, variable.id, newName)}
                                  onValueChange={(newValue) => this.onVarValueChange(profile, variable.id, newValue)}
                                  onDelete={() => this.onVarDelete(profile, variable.id)} />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isDirty && (
                <div className="commit-row button-group left-aligned">
                  <button className="btn btn-primary" onClick={() => this.onSave()}>Save Variable Changes</button>
                  <button className="btn btn-secondary" onClick={() => this.onReset()}>Reset</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  onVarNameChange(profile, variableId, newName) {

    if (profile.inherited) return;
    var { tmpVariables } = this.state;

    var thisVariable = _.find(tmpVariables, {id: variableId});

    if (thisVariable) {
      thisVariable.name = newName;
      this.setState(this.state, this.checkDirty);
    }

  }

  onVarValueChange(profile, variableId, newValue) {

    if (profile.inherited) return;
    var { tmpVariables } = this.state;

    var thisVariable = _.find(tmpVariables, {id: variableId});

    if (thisVariable) {
      thisVariable.defaultValue = newValue;
      this.setState(this.state, this.checkDirty);
    }

  }

  onVarDelete(profile, variableId) {

    if (profile.inherited) return;
    var { tmpVariables } = this.state;

    var variableIndex = _.findIndex(tmpVariables, {id: variableId});

    if (variableIndex > -1) {
      tmpVariables.splice(variableIndex, 1);
      this.setState(this.state, this.checkDirty);
    }

  }

  onVarAdd(profile, type = "STRING_VAR") {

    if (profile.inherited) return;
    var { tmpVariables } = this.state;

    if (type === "STRING_VAR") {
      var newVar = new StringVariable("name", "value");
      tmpVariables.push(newVar);
      this.setState(this.state, this.checkDirty);
    }

    if (type === "ENV_VAR") {
      var newVar = new EnvVarModel();
      tmpVariables.unshift(newVar);
      this.setState(this.state, this.checkDirty);
    }

  }

  onToggle(profile) {
    Message.to(Message.SESSION, "toggleProfile", profile.id);
  }

  onProfileNameChange(profile, newName) {
    if (profile.inherited) return;
    Message.to(Message.SESSION, "changeDataProfileName", {profileId: profile.id, newName});
  }

  // onProfileNameChange(profile, newName) {
  //
  //   if (profile.inherited) return;
  //   const { closedProfiles } = this.props;
  //   var { tmpVariables } = this.state;
  //
  //   tmpVariables.name = newName;
  //
  //   if (closedProfiles.indexOf(profile.id) !== -1) {
  //     this.onToggle(profile)
  //   }
  //
  //   this.setState(this.state, this.checkDirty);
  //
  // }

  onProfileRemove(profile) {
    if (profile.inherited) return;
    if (confirm("Deletion is permanent.  Are you sure?")) Message.to(Message.SESSION, "removeDataProfile", profile.id);
  }

  onSetHidden(profile, hidden) {
    if (profile.inherited) return;
    Message.to(Message.SESSION, "changeDataProfileHidden", {profileId: profile.id, hidden});
  }

  checkDirty() {
    this.setState({isDirty: !_.isEqual(this.props.profile.variables, this.state.tmpVariables)})
  }

  onReset() {
    this.setState({tmpVariables: deepClone(this.props.profile.variables), isDirty: false})
  }

  onSave() {
    Message.promise("updateEnv", {updatedProfile: {...this.props.profile, variables: this.state.tmpVariables}}).then(() => {
      this.setState({isDirty: false})
    });
  }

}

export default DataProfile;
