import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message'
import ActionSelector from './ActionSelector'
import DescriptionSelector from "./DescriptionSelector";

class DetailsSectionWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timeout: this.props.action.timeout || null,
      isEditing: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action.timeout !== this.state.timeout && !this.state.isEditing) {
      this.setState({timeout: nextProps.action.timeout});
    }
  }

  render() {

    const { action, hideTimeout = false, hideContinueOnFail = false, hideDescription = false, userSettings = {}} = this.props;
    const { timeout } = this.state;

    return (
      <div className="details-section" onClick={(e) => e.stopPropagation()}>
        {userSettings.showWarnings && action.warnings.length > 0 && (
          <div className="warning-panel grid-row details-row">
            <div className="text grid-item">
              Couldn't find a good selector during recording.  This action will break easily.
            </div>
            <a className="dismiss" onClick={() => this.onIgnoreClick()}>ignore</a>
          </div>
        )}
        {this.props.children}
        {!hideTimeout && (
          <div className="details-row">
            <div className="details-row-title">Timeout after:</div>
            <label className="grid-row v-align global-timeout">
              <input type="checkbox"
                     checked={timeout === null}
                     onClick={(e) => this.onTimeoutCheckboxChange(e)} />
              Global
            </label>
            <input className="text-input"
                   disabled={timeout === null}
                   type="number"
                   value={ (_.isString(timeout) || _.isNumber(timeout)) ? timeout : userSettings.globalTimeout }
                   onFocus={() => this.setState({isEditing: true})}
                   onBlur={() => this.onTimeoutBlur()}
                   onChange={(e) => this.onTimeoutChange(e)} />
            (ms)
          </div>
        )}
        {!hideDescription && (
          <div className="details-row">
            <div className="details-row-title">Description:</div>
            <DescriptionSelector action={action}/>
          </div>
        )}
        {!hideContinueOnFail && (
          <div className="details-row">
            <div className="details-row-title">Make this action optional. (continue on failure):</div>
            <input type="checkbox" checked={action.continueOnFail} onChange={(e) => this.onSkipFailedChange(e) }/>
          </div>
        )}
      </div>
    )
  }

  onTimeoutBlur() {
    this.setState({isEditing: false});
    this.applyNewTimeout(this.state.timeout);
  }

  onTimeoutChange(e) {
    this.setState({timeout: e.currentTarget.value})
  }

  applyNewTimeout(newTimeout) {

    const { action, parentAction } = this.props;

    if (_.isNull(newTimeout)) {
      action.timeout = null;
    } else {
      action.timeout = parseInt(newTimeout);
    }

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

  onTimeoutCheckboxChange(e) {
    if (e.currentTarget.checked) {
      this.applyNewTimeout(null);
    } else {
      this.applyNewTimeout(_.isNumber(this.state.timeout) ? this.state.timeout : this.props.userSettings.globalTimeout);
    }
  }

  onIgnoreClick() {
    const { action, parentAction } = this.props;
    action.warnings = [];

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

  onSkipFailedChange(e) {
    const { action, parentAction } = this.props;
    action.continueOnFail = e.currentTarget.checked;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

}

export default DetailsSectionWrapper;
