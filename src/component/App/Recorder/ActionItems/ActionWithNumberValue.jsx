import React from 'react'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'
import _ from 'lodash'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class ActionWithNumberValue extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded, showComment, userSettings } = this.props;

    const valueSelector = (
      <div className="grid-item">
        <div className="value-tag">
          <EditableLabel value={action.value + ""} onChange={(newValue) => this.onValueChange(newValue)}/>
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
            <div className="joiner-phrase">Tab #:</div>,
            valueSelector,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props} userSettings={userSettings} hideTimeout>
            <div className="details-row">
              <div className="details-row-title">Window/tab:</div>
              {valueSelector}
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

  onValueChange(newValue) {
    const { action, parentAction } = this.props;

    newValue = parseInt(newValue);

    if (_.isNumber(newValue)) {
      action.value = newValue;

      if (parentAction) {
        parentAction.value = action;
        Message.to(Message.SESSION, "updateNWAction", parentAction);
      } else {
        Message.to(Message.SESSION, "updateNWAction", action);
      }

    }
  }

}


export default ActionWithNumberValue;
