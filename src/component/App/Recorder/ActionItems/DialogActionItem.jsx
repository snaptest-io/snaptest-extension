import React from 'react'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'
import Message from '../../../../util/Message'
import ActionSelector from '../ActionSelector'

class DialogActionItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isHovered: false
    }

  }

  render() {

    const { action, isExpanded, activeTest, showComment, userSettings } = this.props;
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

    return (
      <div className="grid-item grid-row nw-action-con grid-column h-align">
        <div className="action-info">
          <ActDesToggle showComment={showComment}
                        {...this.props}
                        showWarnings={userSettings.warnings}/>
          {showComment ? (
            <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            <div className="grid-row v-align">
              <a onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "toggleActionExpanded", action.id); }}>Configure</a>
            </div>,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={userSettings} hideContinueOnFail hideTimeout>
            <div className="details-row">
              <div className="details-row-title">Auto-Answer alerts with:</div>
              <input type="checkbox" checked={action.alert} onChange={(e) => this.onActionChange("alert", e.currentTarget.checked) }/>
              <div className="details-row-title">OK</div>
            </div>
            <div className="details-row">
              <div className="details-row-title">Auto-answer confirms with:</div>
              <input type="checkbox" checked={action.confirm} onChange={(e) => this.onActionChange("confirm", true) }/>
              <div className="details-row-title">OK</div>
              <input type="checkbox" checked={!action.confirm} onChange={(e) => this.onActionChange("confirm", false) }/>
              <div className="details-row-title">Cancel</div>
            </div>
            <div className="details-row">
              <div className="details-row-title">Auto-answer prompts:</div>
              <input type="checkbox" checked={action.prompt} onChange={(e) => this.onActionChange("prompt", e.currentTarget.checked) }/>
              <div className="details-row-title">with:</div>
              <input type="text" disabled={!action.prompt} value={action.promptResponse} onChange={(e) => this.onActionChange("promptResponse", e.currentTarget.value) }/>
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


export default DialogActionItem;
