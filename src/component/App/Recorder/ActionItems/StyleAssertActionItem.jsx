import React from 'react'
import * as Actions from '../../../../models/Action'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import SelectorSelector from '../SelectorSelector'
import ValueSelector from '../ValueSelector'
import Message from '../../../../util/Message'
import {EditableLabel} from '../../../../component'
import ActDesToggle from '../ActDesToggle'
import DescriptionSelector from '../DescriptionSelector'

class StyleAssertActionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isExpanded, activeTest, showComment, userSettings } = this.props;
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
              <div className="joiner-phrase">of</div>,
              <SelectorSelector {...this.props}
                                variableNames={variableNames} prefix="of..."/>,
              <div className="joiner-phrase">is...</div>,
              <div onClick={(e) => e.stopPropagation()} className="value-selector">
                <div className="value-tag">
                  <EditableLabel value={action.style}
                                 onChange={(newValue) => this.onStyleChange(newValue)}
                                 size={false}
                                 variableNames={variableNames}/>
                </div>
              </div>,
              <div className="joiner-phrase">:</div>,
              <ValueSelector {...this.props}
                             variableNames={variableNames} />,
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
                  <div className="details-row-title">Style:</div>
                  <div onClick={(e) => e.stopPropagation()} className="value-selector">
                    <div className="value-tag">
                      <EditableLabel value={action.style}
                                     onChange={(newValue) => this.onStyleChange(newValue)}
                                     size={false}/>
                    </div>
                  </div>
                </div>
                <div className="details-row">
                  <div className="details-row-title">{action.type === Actions.SCREENSHOT ? ("Filename:") : "Assert value:"} </div>
                  <ValueSelector {...this.props}
                                 variableNames={variableNames} />
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

  onStyleChange(newStyle) {
    const { action, parentAction } = this.props;
    action.style = newStyle;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

}


export default StyleAssertActionItem;
