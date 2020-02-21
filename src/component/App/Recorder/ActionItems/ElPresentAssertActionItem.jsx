import React from 'react'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'

class ElPresentAssertActionItem extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isViewingMore: false
    }
  }

  render() {

    const { action, actionTypeGroups, onActionTypeChange } = this.props;
    const { isViewingMore } = this.state;

    return (
      <div className="grid-item grid-row nw-action-con grid-column" >
        <div className="action-info">
          <div className="action-type">
            <select value={action.type} onChange={(e) => onActionTypeChange(action, e.currentTarget.value) }>
              {actionTypeGroups.map((actionTypeGroup) =>
                <optgroup label={actionTypeGroup.label}>
                  {actionTypeGroup.options.map((option) =>
                    <option disabled={option.disabled} value={option.value}>{option.name}</option>
                  )}
                </optgroup>
              )}
            </select>
          </div>
          <div className="grid-item"></div>
          <div className="selector">
            <EditableLabel value={action.selector} size={action.selector.length}
                           onChange={(newValue) => this.onSelectorChange(newValue, "selector")}/>
          </div>
          { action.warnings.length > 0 && (
              <img className="warning-icon" src={chrome.extension.getURL("assets/warning.png")} onClick={() => this.onSelectorWarningClick()}/>
          )}
        </div>
        {(isViewingMore && action.warnings.length > 0) && (
          <div className="grid-row grid-column warnings">
            {action.warnings.map((warning) => (
                <div>{warning}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  onSelectorWarningClick() {
    this.setState({
      isViewingMore: !this.state.isViewingMore
    })
  }

  onSelectorChange(newSelector, selectorType) {
    const { action } = this.props;
    action[selectorType] = newSelector;
    Message.to(Message.SESSION, "updateNWAction", action);
  }

}


export default ElPresentAssertActionItem;
