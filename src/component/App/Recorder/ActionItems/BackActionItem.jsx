import React from 'react'
import Message from '../../../../util/Message'
import QuickActions from '../QuickActions';
import ActionSelector from '../ActionSelector'
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class BackActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded, showComment } = this.props;

    return (
      <div className="grid-item grid-row nw-action-con grid-column">
        <div className="action-info">
          <ActDesToggle showComment={showComment}
                        {...this.props} />
          {showComment ? (
              <DescriptionSelector action={action} />
          ) : ([
            <ActionSelector {...this.props} />,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (<DetailsSectionWrapper {...this.props} userSettings={this.props.userSettings} hideTimeout /> )}
      </div>
    )
  }
}


export default BackActionItem;
