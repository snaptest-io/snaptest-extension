import React from 'react'
import Message from '../../../../util/Message'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class ScriptActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded, showComment, isInComponentAction } = this.props;

    return (
      <div className="grid-item grid-row nw-action-con grid-column script-action">
        <div className="action-info">
          <ActDesToggle showComment={showComment}
                        {...this.props}/>
          {showComment ? (
              <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            <div className="grid-item grid-row v-align">
              <div className="script-desc"><div>{action.description}</div></div>
            </div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props} userSettings={this.props.userSettings}>
            <div className="details-row"
                 onClick={(e) => e.stopPropagation() }>
              <div className="warnings">Warning: Scripts run in SnapTest are sandboxed, and can only access the DOM - For full access, run the generated Selenium code.</div>
            </div>
            <div className="details-row">
              <div className="details-row-title">Script:</div>
              <textarea className="script-area" value={action.script}
                        onClick={(e) => e.stopPropagation() }
                        onChange={(e) => this.onScriptChange(e.currentTarget.value)}></textarea>
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

  onScriptChange(newScriptValue) {
    const { action, parentAction } = this.props;
    action.script = newScriptValue;
    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }


}


export default ScriptActionItem;
