import React from 'react'
import _ from 'lodash'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'
import ActionItemLine from '../ActionItemLine';
import Route from '../../../../models/Route'
import QuickActions from '../QuickActions';
import ReactTooltip from 'simple-react-tooltip'
import ActionSelector from '../ActionSelector'

class ComponentActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, drafts = [], components, component, playbackResult, playbackCursor, playbackBreakpoints, isExpanded, isPlayingBack, instigatorId, isInComponent, isInComponentAction, activeTest } = this.props;

    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

    return (
      <div className={"grid-item grid-row nw-action-con grid-column"}>
        <div className="action-info">
          <ActionSelector {...this.props} />
          {component && component.inherited ? (
            <div>
              <svg viewBox="0 0 20 20" className="svg-icon svg-icon-lock" data-tip="Editing is locked on inherited components." data-for="locked-tooltip">
                <path id="lock_1_" d="M15.93,9H14V4.99c0-2.21-1.79-4-4-4s-4,1.79-4,4V9H3.93C3.38,9,3,9.44,3,9.99v8C3,18.54,3.38,19,3.93,19h12
                c0.55,0,1.07-0.46,1.07-1.01v-8C17,9.44,16.48,9,15.93,9z M8,9V4.99c0-1.1,0.9-2,2-2s2,0.9,2,2V9H8z"/>
              </svg>
              <ReactTooltip id="locked-tooltip" place="top" type="dark" effect="solid" />
            </div>
          ) : component ? (
            <div className="quick-button component-edit" onClick={() => this.onEditComponentClick(component) }>
              <img src={chrome.extension.getURL("assets/edit_2.png")} />
            </div>
          ) : null}
          {(component && component.variables.length > 0) ? (
            <div className="grid-item grid-row grid-flexwrap">
              {component.variables.map((variable, idx) => (
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
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id}
                        component={component}
                        onExplodeComponentClick={() => this.onExplodeComponentClick(component.id, action.id)}/>
        </div>
        {(component && (isExpanded || isPlayingBack || !_.isEmpty(playbackResult) )) && (
          <div className="grid-row grid-column component-rows">
            {component.actions.map((action, idx) => (
              <ActionItemLine {...this.props}
                              action={action}
                              idx={idx}
                              components={components}
                              isInComponentAction={true}
                              isLast={idx===component.actions.length - 1}
                              playbackResult={playbackResult}
                              playbackCursor={playbackCursor}
                              showQuickActions={false}
                              playbackBreakpoints={playbackBreakpoints}
                              instigatorId={instigatorId} />
            ))}
          </div>
        )}
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

  onComponentChange(newComponentId) {
    const { action, parentAction } = this.props;
    action.componentId = newComponentId;
    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }

  onEditComponentClick(component) {
    Message.to(Message.SESSION, "setComponentActive", component.id);
    Message.to(Message.SESSION, "pushRoute", new Route("componentbuilder", { componentId: component.id } ) );
  }

  onExplodeComponentClick(componentId, actionId) {
    Message.to(Message.SESSION, "explodeComponent", {componentId, actionId });
  }

  onComponentNameChange(newValue, component) {
    component.name = newValue;
    Message.to(Message.SESSION, "updateComponent", component);
  }

}


export default ComponentActionItem;
