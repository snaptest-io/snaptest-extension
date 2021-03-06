import React from 'react'
import Message from '../../../../util/Message'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import SelectorSelector from '../SelectorSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'
import * as Actions from '../../../../models/Action';

class MouseClickActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded = false, activeTest, showComment, userSettings} = this.props;
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

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
              <div className="details-row-title">Selector:</div>
              <SelectorSelector {...this.props}
                                variableNames={variableNames}/>
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

}


export default MouseClickActionItem;
