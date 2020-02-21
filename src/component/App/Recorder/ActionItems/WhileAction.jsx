import React from 'react'
import Message from '../../../../util/Message'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import SelectorSelector from '../SelectorSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'
import ActionItem from "../ActionItem";

class WhileAction extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded = false, showComment, userSettings} = this.props;

    return (
      <div className="grid-item grid-row nw-action-con grid-column conditional">
        <div className="action-info">
          <ActDesToggle {...this.props}
                        showWarnings={userSettings.warnings}/>
          {showComment ? (
            <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            <ActionItem {...this.props}
                        action={action.value || action.condition}
                        parentAction={action}
                        hideDuplicate
                        hideDelete
                        hideMoreInfo
                        hideDescription
                        showComment={false} />
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={userSettings}
                                 hideTimeout >
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

}


export default WhileAction;
