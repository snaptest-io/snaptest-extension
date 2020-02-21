import React from 'react'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'
import {CompVariable} from '../../../../models/Variable';
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import ValueSelector from '../ValueSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class PauseActionItem extends React.PureComponent {

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
            <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            <ValueSelector {...this.props} integer/>,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props} userSettings={this.props.userSettings}>
            <div className="details-row">
              <div className="details-row-title">Milliseconds:</div>
              <ValueSelector {...this.props} integer/>
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

}


export default PauseActionItem;
