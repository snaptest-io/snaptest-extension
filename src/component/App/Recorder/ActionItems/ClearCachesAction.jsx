import React from 'react'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'
import Message from '../../../../util/Message'

class ClearCachesAction extends React.Component {

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
        <div className="grid-item grid-row nw-action-con grid-column h-align">
          <div className="action-info">
            <ActDesToggle showComment={showComment}
                          {...this.props}
                          showWarnings={userSettings.warnings}/>
            {showComment ? (
                <DescriptionSelector {...this.props} />
            ) : ([
              <ActionSelector {...this.props} />,
              <div className="grid-row v-align configure-link">
                <a onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "toggleActionExpanded", action.id); }}>Configure</a>
              </div>,
              <div className="grid-item"></div>
            ])}
            <QuickActions {...this.props}
                          isHovered={this.state.isHovered}
                          isSelectingForEl={this.props.selectingForActionId === action.id} />
          </div>
          {(isExpanded) && (
            <DetailsSectionWrapper {...this.props} userSettings={userSettings} hideTimeout hideContinueOnFail>
              <div className="details-row">
                <div className="details-row-title">Clear cookies:</div>
                <input type="checkbox" checked={action.cookies} onChange={(e) => this.onActionChange("cookies", e.currentTarget.checked) }/>
                <div className="details-row-title">of domain:</div>
                <input type="text" disabled={!action.cookies} value={action.cookieDomain} onChange={(e) => this.onActionChange("cookieDomain", e.currentTarget.value) }/>
              </div>
              <div className="details-row">
                <div className="details-row-title">Clear localstorage:</div>
                <input type="checkbox" checked={action.localstorage} onChange={(e) => this.onActionChange("localstorage", e.currentTarget.checked) }/>
              </div>
              <div className="details-row">
                <div className="details-row-title">Clear sessionstorage:</div>
                <input type="checkbox" checked={action.sessionstorage} onChange={(e) => this.onActionChange("sessionstorage", e.currentTarget.checked) }/>
              </div>
              <div className="details-row">
                <div className="details-row-title">Clear indexdb:</div>
                <input type="checkbox" checked={action.indexdb} onChange={(e) => this.onActionChange("indexdb", e.currentTarget.checked) }/>
                <div className="details-row-title">of databases: (comma separated)</div>
                <input type="text" disabled={!action.indexdb} value={action.indexdbDatabases} onChange={(e) => this.onActionChange("indexdbDatabases", e.currentTarget.value) }/>
              </div>
            </DetailsSectionWrapper>
          )}
        </div>
    )
  }

  onActionChange(fieldName, value) {
    const { action, parentAction } = this.props;

    action[fieldName] = value;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }

  }

}


export default ClearCachesAction;
