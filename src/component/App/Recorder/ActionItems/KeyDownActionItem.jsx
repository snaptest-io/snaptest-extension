import React from 'react'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import SelectorSelector from '../SelectorSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class KeyDownActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, selectingForActionId, isInComponentAction, selectionCandidate = "select element...", isExpanded, activeTest, showComment, userSettings } = this.props;
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

    const valueSelector = (
      <div className="" onClick={(e) => e.stopPropagation() }>
        <div className="value-tag section-right">
          <select value={action.keyValue} onChange={(e) => this.onValueChange(e.currentTarget.value)}>
            <option value="">...</option>
            <option value="Enter">Enter</option>
            <option value="Escape">Escape</option>
          </select>
        </div>
      </div>
    );

    return (
      <div className="grid-item grid-row nw-action-con grid-column">
        <div className="action-info">
          <ActDesToggle showComment={showComment}
                        {...this.props}
                        showWarnings={userSettings.warnings}/>
          {showComment ? (
              <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            valueSelector,
            <SelectorSelector {...this.props}
                              variableNames={variableNames}/>,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={userSettings}>
            <div className="details-row">
              <div className="details-row-title">Value:</div>
              {valueSelector}
            </div>
            <div className="details-row">
              <div className="details-row-title">Selector:</div>
              <SelectorSelector {...this.props}
                                variableNames={variableNames}/>
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

  onValueChange(newValue) {
    const { action, parentAction } = this.props;
    action.keyValue = newValue;
    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }


}


export default KeyDownActionItem;
