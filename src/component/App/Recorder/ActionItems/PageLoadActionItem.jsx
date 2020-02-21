import React from 'react'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'
import * as Actions from '../../../../models/Action'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import ValueSelector from '../ValueSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class PageLoadActionItem extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isHovered: false
    }

  }

  render() {

    const { action, isExpanded, showComment, activeTest, userSettings } = this.props;
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

    return (
      <div className="grid-item grid-row nw-action-con grid-column h-align">
        <div className="action-info">
          <ActDesToggle {...this.props}
                        showComment={showComment}
                        showWarnings={userSettings.warnings}/>
          {showComment ? (
            <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            <ValueSelector {...this.props}
                           variableNames={variableNames} />,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={this.props.userSettings} >
            <div className="details-row">
              <div className="details-row-title">Url:</div>
              <ValueSelector {...this.props}
                             variableNames={variableNames} />
            </div>
            <div className="details-row">
              <div className="details-row-title">Window:</div>
              <div className="grid-row v-align">
                <div className="value-tag-label">Width:</div>
                <div className="value-tag">
                  <EditableLabel value={action.width}
                                 size={6}
                                 onChange={(newValue) => this.onChangeWidth(newValue)}/>
                </div>
                <div className="value-tag-label">Height:</div>
                <div className="value-tag">
                  <EditableLabel value={action.height}
                                 size={6}
                                 onChange={(newValue) => this.onChangeHeight(newValue)}/>
                </div>
              </div>
            </div>
            <div className="details-row">
              <div className="details-row-title">Require Complete Load:</div>
              <label className="grid-row v-align global-timeout">
                <input type="checkbox"
                       checked={action.complete && action.complete === true}
                       onClick={(e) => this.onChangeRequireComplete(e.currentTarget.checked)}/>
                Yes
              </label>
            </div>
            <div className="details-row">
              <div className="details-row-title">Resize:</div>
              <label className="grid-row v-align global-timeout">
                <input type="checkbox"
                       checked={action.resize && action.resize === true}
                       onClick={(e) => this.onChangeResize(e.currentTarget.checked)}/>
                Yes
              </label>
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

  onChangeResize(resize) {
    const { action, parentAction } = this.props;
    action.resize = resize;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

  onChangeRequireComplete(complete) {
    const { action, parentAction } = this.props;
    action.complete = complete;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }

  onChangeWidth(newWidth) {
    const { action, parentAction } = this.props;

    var newWidth = parseInt(newWidth);

    if (newWidth) {
      action.width = newWidth;

      if (parentAction) {
        parentAction.value = action;
        Message.to(Message.SESSION, "updateNWAction", parentAction);
      } else {
        Message.to(Message.SESSION, "updateNWAction", action);
      }

    }
  }

  onChangeHeight(newHeight) {
    const { action, parentAction } = this.props;

    var newHeight = parseInt(newHeight);

    if (newHeight) {
      action.height = newHeight;

      if (parentAction) {
        parentAction.value = action;
        Message.to(Message.SESSION, "updateNWAction", parentAction);
      } else {
        Message.to(Message.SESSION, "updateNWAction", action);
      }

    }
  }

}


export default PageLoadActionItem;
