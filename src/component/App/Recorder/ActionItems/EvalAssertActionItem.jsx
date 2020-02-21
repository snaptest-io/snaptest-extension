import React from 'react'
import * as Actions from '../../../../models/Action'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import ValueSelector from '../ValueSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class EvalAssertActionItem extends React.PureComponent {

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
      <div className="grid-item grid-row nw-action-con conditional grid-column h-align ">
        <div className="action-info">
          <ActDesToggle showComment={showComment}
                        {...this.props}
                        showWarnings={userSettings.warnings}/>
          {showComment ? (
            <DescriptionSelector {...this.props} />
          ) : ([
            <ActionSelector {...this.props} />,
            <ValueSelector {...this.props}
                           variableNames={variableNames}
                           prefix={"$("}
                           postfix={")"} />,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={userSettings}>
            <div className="details-row">
              <div className="details-row-title">Value:</div>
              <ValueSelector {...this.props}
                             variableNames={variableNames}
                             allowRegex />
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

}


export default EvalAssertActionItem;
