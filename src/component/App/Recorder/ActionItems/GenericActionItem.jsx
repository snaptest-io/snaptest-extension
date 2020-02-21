import React from 'react'
import * as Actions from '../../../../models/Action'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'

class MouseClickActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, actionTypes, onActionTypeChange } = this.props;

    return (
      <div className="grid-item grid-row v-align">
        <div className="action-type">
          { action.type === Actions.POPSTATE ? (
              "Back"
          ) : action.type === Actions.PAGELOAD ? (
              <select value={action.type} onChange={(e) => onActionTypeChange(action, e.currentTarget.value) }>
                {actionTypes.map((actionType) => <option value={actionType.value}>{actionType.name}</option>)}
              </select>
          ) : action.type === Actions.MOUSEDOWN ? (
              <select value={action.type} onChange={(e) => onActionTypeChange(action, e.currentTarget.value) }>
                {actionTypes.map((actionType) => <option value={actionType.value}>{actionType.name}</option>)}
              </select>
          ) : action.type === Actions.INPUT ? (
              <select value={action.type} onChange={(e) => onActionTypeChange(action, e.currentTarget.value) }>
                {actionTypes.map((actionType) => <option value={actionType.value}>{actionType.name}</option>)}
              </select>
          ) : action.type === Actions.TEXT_ASSERT ? (
              <select value={action.type} onChange={(e) => onActionTypeChange(action, e.currentTarget.value) }>
                {actionTypes.map((actionType) => <option value={actionType.value}>{actionType.name}</option>)}
              </select>
          ) : action.type === Actions.BLANK ? (
              <select onChange={(e) => onActionTypeChange(action, e.currentTarget.value) }>
                {actionTypes.map((actionType) => <option value={actionType.value}>{actionType.name}</option>)}
              </select>
          ) : action.type === Actions.PUSHSTATE? (
              "Url change"
          ) : (
              <span>{action.type}</span>
          )}
        </div>
        <div className="grid-item grid-row v-align nw-action-con" >
          <div className="grid-item">
            {action.value ? (
                <div className="value-tag">
                  <EditableLabel value={action.value} onChange={(newValue) => this.onValueChange(newValue)}/>
                </div>
            ) : (action.textContent && !action.textAsserted )? (
                <div className="assert-tag">
                  <span className="assert" onClick={() => { this.onAddNWTextAssertion(action) }}>auto: </span><span className="value"> assert text: {action.textContent.substring(0, 20)}...</span>
                </div>
            ) : action.text ? (
                <div className="value-tag">
                  <EditableLabel value={action.text} onChange={(newValue) => this.onTextAssertionChange(newValue)}/>
                </div>
            ) : null}
          </div>
          <div className="selector">
            {action.url ? (
                <EditableLabel value={action.url} size={action.url.length} onChange={(newValue) => this.onUrlChange(newValue)}/>
            ) : action.selector ? (
                <EditableLabel value={action.selector} size={action.selector.length}
                               onChange={(newValue) => this.onSelectorChange(newValue, "selector")}/>
            ) : action.prettySelector ? (
                <EditableLabel value={action.prettySelector} size={action.prettySelector.length}
                               onChange={(newValue) => this.onSelectorChange(newValue, "prettySelector")}/>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  onValueChange(newValue) {
    const { action } = this.props;
    action.value = newValue;
    Message.to(Message.SESSION, "updateNWAction", action);
  }

  onTextAssertionChange(newValue) {
    const { action } = this.props;
    action.text = newValue;
    Message.to(Message.SESSION, "updateNWAction", action);
  }

  onSelectorChange(newSelector, selectorType) {
    const { action } = this.props;
    action[selectorType] = newSelector;
    Message.to(Message.SESSION, "updateNWAction", action);
  }

  onUrlChange(newUrl) {
    const { action } = this.props;
    action.url = newUrl;
    Message.to(Message.SESSION, "updateNWAction", action);
  }

  onAddNWTextAssertion(action) {
    var textAssertAction = new Actions.TextAssertAction(action.prettySelector || action.selector, action.textContent);
    Message.to(Message.SESSION, "insertNWActionBefore", { insertBefore: action.id, action: textAssertAction });
  }

}


export default MouseClickActionItem;
