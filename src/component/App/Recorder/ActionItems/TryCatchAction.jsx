import React from 'react'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class MouseClickActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded = false, showComment, userSettings} = this.props;

    return (
      <div className="grid-item grid-row nw-action-con grid-column conditional">
        <div className="action-info">
          <ActDesToggle showComment={showComment}
                        {...this.props}
                        showWarnings={userSettings.warnings}/>
          {showComment ? (
            <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={userSettings} >
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

}


export default MouseClickActionItem;
