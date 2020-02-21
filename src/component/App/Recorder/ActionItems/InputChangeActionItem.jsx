import React from 'react'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import SelectorSelector from '../SelectorSelector'
import ValueSelector from '../ValueSelector'
import Message from '../../../../util/Message'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class InputChangeActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded, activeTest, showComment, userSettings } = this.props;
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

    return (
      <div className="grid-item grid-row nw-action-con grid-column">
        <div className="action-info">
          <ActDesToggle {...this.props}
                        showWarnings={userSettings.warnings}/>
          {showComment ? (
            <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props}  />,
            <ValueSelector {...this.props}
                           variableNames={variableNames} />,
            <SelectorSelector {...this.props}
                              variableNames={variableNames} />,
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
              <ValueSelector {...this.props}
                             variableNames={variableNames} />
            </div>
            <div className="details-row">
              <div className="details-row-title">Selector:</div>
              <SelectorSelector {...this.props}
                                variableNames={variableNames} />
            </div>
            <div className="details-row">
              <div className="details-row-title">isContentEditable: (uses innerHTML)</div>
              <input type="checkbox" checked={action.isContentEditable} onChange={(e) => this.onChangeContentEditable(e) } />
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

  onChangeContentEditable(e) {
    const { action, parentAction } = this.props;
    action.isContentEditable = e.currentTarget.checked;
    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }

}


export default InputChangeActionItem;
