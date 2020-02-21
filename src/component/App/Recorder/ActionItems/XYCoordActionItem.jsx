import React from 'react'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'
import * as Actions from '../../../../models/Action'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import SelectorSelector from '../SelectorSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class XYCoordActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded, activeTest, showComment, userSettings } = this.props;
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

    const valueSelector = (
      <div className="grid-item grid-row">
        <div className="grid-row v-align">
          <div className="value-tag-label">X: </div>
          <div className="value-tag">
            <EditableLabel value={action.x + ""} onChange={(newValue) => this.onXChange(newValue)}/>
          </div>
        </div>
        <div className="grid-row v-align">
          <div className="value-tag-label">Y: </div>
          <div className="value-tag">
            <EditableLabel value={action.y + ""} onChange={(newValue) => this.onYChange(newValue)}/>
          </div>
        </div>
      </div>
    );


    return (
      <div className="grid-item grid-row grid-column nw-action-con xy-coord-action">
        <div className="action-info">
          <ActDesToggle showComment={showComment}
                        {...this.props}
                        showWarnings={userSettings.warnings}/>
          {showComment ? (
              <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            valueSelector,
            action.type === Actions.SCROLL_ELEMENT ? (<SelectorSelector {...this.props}
                                                                        variableNames={variableNames}/>) : null,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={userSettings} >
            <div className="details-row">
              <div className="details-row-title">Value:</div>
              {valueSelector}
            </div>
            {action.type === Actions.SCROLL_ELEMENT && (
              <div className="details-row">
                <div className="details-row-title">Selector:</div>
                <SelectorSelector {...this.props}
                                  variableNames={variableNames}/>
              </div>
            )}
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }


  onXChange(newX) {
    const { action, parentAction } = this.props;

    newX = parseInt(newX);

    if (newX) {
      action.x = newX;
      if (parentAction) {
        parentAction.value = action;
        Message.to(Message.SESSION, "updateNWAction", parentAction);
      } else {
        Message.to(Message.SESSION, "updateNWAction", action);
      }
    }

  }

  onYChange(newY) {
    const { action, parentAction } = this.props;

    newY = parseInt(newY);

    if (newY) {
      action.y = newY;
      if (parentAction) {
        parentAction.value = action;
        Message.to(Message.SESSION, "updateNWAction", parentAction);
      } else {
        Message.to(Message.SESSION, "updateNWAction", action);
      }
    }
  }


}


export default XYCoordActionItem;
