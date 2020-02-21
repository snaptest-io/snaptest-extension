import React from 'react'
import _ from 'lodash'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'
import ActionItemLine from '../ActionItemLine';
import Route from '../../../../models/Route'
import QuickActions from '../QuickActions';
import ReactTooltip from 'simple-react-tooltip'
import ActionSelector from '../ActionSelector'

class RequestActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, tests, activeTest } = this.props;
    const request = _.find(tests, {id: action.reqId});
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

    return (
      <div className={"grid-item grid-row nw-action-con grid-column"}>
        <div className="action-info">
          <div>
            <div className="square handle">{request.method} request</div>
          </div>
          <ActionSelector {...this.props} actionName={request.name} />
          { request ? (
            <div className="quick-button component-edit" onClick={() => this.onEditClick(request) }>
              <img src={chrome.extension.getURL("assets/edit_2.png")} />
            </div>
          ) : null}
          {(request && request.variables.length > 0) ? (
            <div className="grid-item grid-row grid-flexwrap">
              {request.variables.map((variable, idx) => (
                <div className="variable" key={idx}>
                  <div className="key">
                    {variable.name}
                  </div>
                  <div className="default">
                    <EditableLabel value={this.getVarValue(variable)}
                                   highlight={["${random}", "${random1}", "${random2}", "${random3}", "${default}"].concat(variableNames)}
                                   size={this.getVarValue(variable).length}
                                   onChange={(newValue) => this.onVariableValueChange(variable, newValue)}/>
                  </div>
                </div>
              ))}
            </div>
          ) : (<div className="grid-item"></div>)}
          <QuickActions {...this.props} />
        </div>
      </div>
    )
  }

  // see if the action has a variable to override default
  getVarValue(cVar) {
    const { action } = this.props;

    var aVar = _.find(action.variables, {id: cVar.id});

    if (aVar) {
      return aVar.value;
    } else {
      return "${default}";
    }

  }

  onVariableValueChange(variable, newValue) {

    const { action, parentAction } = this.props;

    var varIndex = _.findIndex(action.variables, {id: variable.id});

    if (varIndex !== -1) {
      action.variables.splice(varIndex, 1, {id: variable.id, value: newValue })
    } else {
      action.variables.push({id: variable.id, value: newValue });
    }

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }


  onEditClick(component) {
    // Message.to(Message.SESSION, "setComponentActive", component.id);
    // Message.to(Message.SESSION, "pushRoute", new Route("componentbuilder", { componentId: component.id } ) );
  }

}


export default RequestActionItem;
