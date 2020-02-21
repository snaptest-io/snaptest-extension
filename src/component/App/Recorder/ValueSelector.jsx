import React from 'react'
import _ from 'lodash'
import {EditableLabel, SweetTextInput} from '../../../component'
import Message from '../../../util/Message'
import {CompVariable} from '../../../models/Variable';

class ValueSelector extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, variableNames = [], prefix = "", postfix = "", isInComponent = false} = this.props;

    return (
      <div className="value-selector">
        <div className="value-tag" onClick={(e) => e.stopPropagation() }>
          {_.isBoolean(action.regex) && (
            <span className="value-type"
                  title={action.regex ? "Regular Expression" : "Exact String"}
                  onClick={(e) => { e.stopPropagation(); this.onValueTypeToggle(); }}>{action.regex ? "RegX" : "Str"}</span>
          )}
          {action.regex ? (
            <span>
              <span>
              <EditableLabel value={action.value}
                             highlight={["${random}", "${random1}", "${random2}", "${random3}", "${default}"].concat(variableNames)}
                             onEnter={() => Message.to(Message.SESSION, "closeVarTooltip")}
                             onChange={(newValue) => this.onValueChange(newValue)}
                             preLabel="/"
                             postLabel="/g"
                             size={false}/>
              </span>
            </span>
          ) : (
            <EditableLabel value={action.value}
                           preLabel={prefix}
                           postLabel={postfix}
                           onEnter={() => Message.to(Message.SESSION, "closeVarTooltip")}
                           highlight={["${random}", "${random1}", "${random2}", "${random3}", "${default}"].concat(variableNames)}
                           onChange={(newValue) => this.onValueChange(newValue)}/>
          )}
        </div>
      </div>
    )
  }

  onValueTypeToggle() {
    const { action } = this.props;
    action.regex = !action.regex;
    Message.to(Message.SESSION, "updateNWAction", action);
  }

  onValueChange(newValue) {

    const { integer, action, parentAction } = this.props;

    if (integer) {
      if (parseInt(newValue)) {
        action.value = parseInt(newValue);
      }
    } else {
      action.value = newValue;
    }

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

}


export default ValueSelector;
