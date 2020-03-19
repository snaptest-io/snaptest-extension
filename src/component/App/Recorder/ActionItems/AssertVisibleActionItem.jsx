import React from 'react'
import Message from '../../../../util/Message'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import SelectorSelector from '../SelectorSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'
import * as Actions from '../../../../models/Action';

class AssertVisibleActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded = false, activeTest, showComment, userSettings} = this.props;
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

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
            <SelectorSelector {...this.props}
                              variableNames={variableNames} />,
            <div className="grid-row v-align configure-link">
              <a onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "toggleActionExpanded", action.id); }}>
                <svg
                  className="svg-icon hoverable project-settings"
                  viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 8h-2.31c-.14-.46-.33-.89-.56-1.3l1.7-1.7a.996.996 0 0 0 0-1.41l-1.41-1.41a.996.996 0 0 0-1.41 0l-1.7 1.7c-.41-.22-.84-.41-1.3-.55V1c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2.33c-.48.14-.94.34-1.37.58L5 2.28a.972.972 0 0 0-1.36 0L2.28 3.64c-.37.38-.37.99 0 1.36L3.9 6.62c-.24.44-.44.89-.59 1.38H1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2.31c.14.46.33.89.56 1.3L2.17 15a.996.996 0 0 0 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l1.7-1.7c.41.22.84.41 1.3.55V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.33c.48-.14.94-.35 1.37-.59L15 17.72c.37.37.98.37 1.36 0l1.36-1.36c.37-.37.37-.98 0-1.36l-1.62-1.62c.24-.43.45-.89.6-1.38H19c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-9 6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" id="cog_2_"/>
                </svg>
              </a>
            </div>,
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
              <div className="details-row-title">Selector:</div>
              <SelectorSelector {...this.props}
                                variableNames={variableNames}/>
            </div>
            <div className="details-checkbox-row">
              <label>
                <input type="checkbox" checked={action.checkDisplay} onChange={(e) => this.onActionChange("checkDisplay", e.currentTarget.checked) }/>
                <div>Check "display" attribute (not set to 'none')</div>
              </label>
            </div>
            <div className="details-checkbox-row">
              <label>
                <input type="checkbox" checked={action.checkVisibility} onChange={(e) => this.onActionChange("checkVisibility", e.currentTarget.checked) }/>
                <div>Check "visibility" attribute (not set to 'hidden')</div>
              </label>
            </div>
            <div className="details-checkbox-row">
              <label>
                <input type="checkbox" checked={action.checkOpacity} onChange={(e) => this.onActionChange("checkOpacity", e.currentTarget.checked) }/>
                <div>Check "opacity" attribute (greater than 0.1)</div>
              </label>
            </div>
            <div className="details-checkbox-row">
              <label>
                <input type="checkbox" checked={action.checkDimensions} onChange={(e) => this.onActionChange("checkDimensions", e.currentTarget.checked) }/>
                <div>Check element dimensions area (greater than 0)</div>
              </label>
            </div>
            <div className="details-checkbox-row">
              <label>
                <input type="checkbox" checked={action.checkCenterPoint} onChange={(e) => this.onActionChange("checkCenterPoint", e.currentTarget.checked) }/>
                <div>Check element center point on screen</div>
              </label>
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

  onActionChange(fieldName, value) {
    const { action, parentAction } = this.props;

    action[fieldName] = value;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

}


export default AssertVisibleActionItem;
