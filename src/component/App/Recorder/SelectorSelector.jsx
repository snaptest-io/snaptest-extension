import React from 'react'
import Message from '../../../util/Message'
import {EditableLabel} from '../../../component'
import {SELECTOR_TYPES, SEL_CSS, SEL_XPATH, SEL_TEXT, SEL_ID, SEL_NAME} from '../../../models/Action';

class SelectorSelector extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, selectingForActionId, selectionCandidate = "select element...", variableNames = [], prefix = null, parentAction } = this.props;

    return (
      <div className="selector-selector grid-row v-align-start">
        <div className={"selector" + (action.warnings.length > 0 ? " warning" : "")}
           onClick={(e) => e.stopPropagation()}>
        {(action.selectorType === SEL_CSS || !action.selectorType || action.selectorType === SEL_TEXT || action.selectorType === SEL_ID || action.selectorType === SEL_NAME) ? (
          <div className="action-quick-buttons">
            {selectingForActionId === action.id ? (
              <div className="quick-button" onClick={() => Message.to(Message.SESSION, "cancelSelection") }>
                <img className="selection-icon"
                     src={chrome.extension.getURL("assets/target.png")}/>
              </div>
            ) : (
              <div className="quick-button" onClick={() => Message.to(Message.SESSION, "startSelection", { action, parentAction }) }>
                <img className="selection-icon"
                     src={chrome.extension.getURL("assets/target.png")}/>
              </div>
            )}
          </div>
        ) : (
          <div className="action-quick-buttons">
            <div className="quick-button">
              <img className="selection-icon disabled"
                   src={chrome.extension.getURL("assets/target.png")}/>
            </div>
          </div>
        )}
        {selectingForActionId === action.id ? (
          <div className="selecting-el">
            <span className="value-type" onClick={() => this.onSelectorTypeChange()}>
              {!action.selectorType ? SEL_CSS : action.selectorType}
            </span>
            {selectionCandidate || "click element..."}
          </div>
        ) : (
          <span className="grid-row v-align">
            <span className="value-type" onClick={() => this.onSelectorTypeChange()}>
              {!action.selectorType ? SEL_CSS : action.selectorType}
            </span>
            <EditableLabel value={action.selector}
                           size={action.selector && action.selector.length}
                           onChange={(newValue) => this.onSelectorChange(newValue)}
                           highlight={["${random}", "${random1}", "${random2}", "${random3}"].concat(variableNames)}/>
          </span>
        )}
      </div>
    </div>
    )
  }

  onSelectorChange(newSelector) {
    const { action, parentAction } = this.props;
    action.selector = newSelector;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

  onSelectorTypeChange() {
    const { action, parentAction } = this.props;

    var selectorType = action.selectorType || SEL_CSS;
    var indexOfCurrentSelectorType = SELECTOR_TYPES.indexOf(selectorType);

    if (SELECTOR_TYPES[indexOfCurrentSelectorType + 1]) {
      action.selectorType = SELECTOR_TYPES[indexOfCurrentSelectorType + 1];
    } else {
      action.selectorType = SELECTOR_TYPES[0];
    }

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

}

export default SelectorSelector;
