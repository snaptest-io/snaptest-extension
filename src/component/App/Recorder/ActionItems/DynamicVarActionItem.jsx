import React from 'react'
import Message from '../../../../util/Message'
import * as Actions from '../../../../models/Action'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import SelectorSelector from '../SelectorSelector'
import ValueSelector from '../ValueSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'

class DynamicVarActionItem extends React.PureComponent {

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
            <ActionSelector {...this.props} />,
            <ValueSelector {...this.props}
                           variableNames={variableNames}
                           prefix="${"
                           postfix="}" />,
            <SelectorSelector {...this.props}
                              variableNames={variableNames} />,
            <div className="grid-item"></div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props} userSettings={userSettings}>
            <div className="details-row">
              <div className="details-row-title">{action.type === Actions.SCREENSHOT ? ("Filename:") : "Assert value:"} </div>
              <ValueSelector {...this.props}
                             variableNames={variableNames}  prefix="${" postfix="}" />
            </div>
            <div className="details-row">
              <div className="details-row-title">Selector:</div>
              <SelectorSelector {...this.props}
                                variableNames={variableNames} />
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

}


export default DynamicVarActionItem;
