import React from 'react'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'

class MetaScanActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, actionTypeGroups, onActionTypeChange, isExpanded  } = this.props;

    const actionSelector = (
      <div className="action-type select-wrap">
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
    );

    return (
      <div className="grid-item grid-row nw-action-con grid-column">
        <div className="action-info">
          {action.description ? (
            <div className="description" onClick={() => Message.to(Message.SESSION, "toggleActionExpanded", action.id)}>
              <div>{action.description}</div>
            </div>
          ) : ([
            actionSelector,
            <div className="grid-item"></div>
          ])}
          <div className="action-quick-buttons">
            <a className="quick-button" onClick={() => Message.to(Message.SESSION, "duplicateNWAction", action.id) }>
              <img src={chrome.extension.getURL("assets/duplicate.png")} />
            </a>
            <div className="quick-button" onClick={() => Message.to(Message.SESSION, "removeNWAction", action.id) }>
              <img src={chrome.extension.getURL("assets/trash.png")} />
            </div>
            <div className="quick-button" onClick={() => Message.to(Message.SESSION, "toggleActionExpanded", action.id) }>
              <img src={chrome.extension.getURL(isExpanded ? "assets/info_cancel.png" : "assets/info.png")}/>
            </div>
          </div>
        </div>
        {(isExpanded) && (
          <div className="details-section">
            <div className="details-row">
              <div className="details-row-title">Action:</div>
              {actionSelector}
            </div>
            <div className="details-row">
              <div className="details-row-title">Description:</div>
              <textarea placeholder="Add description..." onChange={(e)=> this.onDescriptionChange(e)}>{action.description}</textarea>
            </div>
          </div>
        )}
      </div>
    )
  }

  onDescriptionChange(e) {
    const { action } = this.props;
    action.description = e.currentTarget.value;
    Message.to(Message.SESSION, "updateNWAction", action);
  }

  onSelectorChange(newSelector) {
    const { action } = this.props;
    action.selector = newSelector;
    action.warnings = [];
    Message.to(Message.SESSION, "updateNWAction", action);
  }

}


export default MetaScanActionItem;
