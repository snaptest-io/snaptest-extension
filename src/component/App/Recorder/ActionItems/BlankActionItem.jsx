import React from 'react'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class BlankActionItem extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isHovered: false
    }

  }

  render() {

    const { action, isExpanded, showComment, activeTest, userSettings } = this.props;

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
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={this.props.userSettings} >
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

}


export default BlankActionItem;
