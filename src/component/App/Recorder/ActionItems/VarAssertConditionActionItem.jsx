import React from "react";
import Message from "../../../../util/Message";
import * as Actions from "../../../../models/Action";
import QuickActions from "../QuickActions";
import DetailsSectionWrapper from "../DetailsSectionWrapper";
import ActionSelector from "../ActionSelector";
import ValueSelector from "../ValueSelector";
import DescriptionSelector from "../DescriptionSelector";
import ActDesToggle from "../ActDesToggle";
import { EditableLabel } from "../../../../component";

class VarAssertConditionActionItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getOperatorSymbol() {
    const { action } = this.props;
    const conditionalType = action.conditionalType || "equals";

    switch (conditionalType) {
      case "equals":
        return "==";
      case "notEquals":
        return "!=";
      case "lessThan":
        return "<";
      case "greaterThan":
        return ">";
      case "lessThanOrEqual":
        return "<=";
      case "greaterThanOrEqual":
        return ">=";
      case "matchRegex":
        return "~=";
      default:
        return "==";
    }
  }

  renderConditionalSelector() {
    const { action } = this.props;

    return (
      <div onClick={(e) => e.stopPropagation()} style={{ margin: "0px 2px" }}>
        {/* <div className="value-tag"> */}
        <select
          className="value-tag"
          style={{ margin: "0px 2px", fontSize: "11px", height: "31px" }}
          value={action.conditionalType || "equals"}
          onChange={(e) => this.onConditionalTypeChange(e.target.value)}
        >
          <option value="equals">==</option>
          <option value="notEquals">!=</option>
          <option value="lessThan">&lt;</option>
          <option value="greaterThan">&gt;</option>
          <option value="lessThanOrEqual">&lt;=</option>
          <option value="greaterThanOrEqual">&gt;=</option>
          {/* <option value="matchRegex">~= (regex)</option> */}
        </select>
        {/* </div> */}
      </div>
    );
  }

  render() {
    const { action, isExpanded, activeTest, showComment, userSettings } =
      this.props;
    const variableNames = activeTest
      ? activeTest.variables.map((variable) => "${" + variable.name + "}")
      : [];

    return (
      <div className="grid-item grid-row nw-action-con grid-column">
        <div className="action-info">
          <ActDesToggle {...this.props} showWarnings={userSettings.warnings} />
          {showComment ? (
            <DescriptionSelector {...this.props} />
          ) : (
            [
              <ActionSelector {...this.props} />,
              <div
                onClick={(e) => e.stopPropagation()}
                className="value-selector"
              >
                <div className="value-tag">
                  <EditableLabel
                    value={action.selector}
                    onChange={(newValue) => this.onSelectorChange(newValue)}
                    size={false}
                    variableNames={variableNames}
                    preLabel="${"
                    postLabel="}"
                  />
                </div>
              </div>,
              this.renderConditionalSelector(),
              <ValueSelector {...this.props} variableNames={variableNames} />,
              <div className="grid-item"></div>,
            ]
          )}
          <QuickActions
            {...this.props}
            isHovered={this.state.isHovered}
            isSelectingForEl={this.props.selectingForActionId === action.id}
          />
        </div>
        {isExpanded && (
          <DetailsSectionWrapper {...this.props} userSettings={userSettings}>
            <div className="details-row">
              <div className="details-row-title">Variable:</div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="value-selector"
              >
                <div className="value-tag">
                  <EditableLabel
                    value={action.selector}
                    onChange={(newValue) => this.onSelectorChange(newValue)}
                    size={false}
                    variableNames={variableNames}
                    preLabel="${"
                    postLabel="}"
                  />
                </div>
              </div>
            </div>
            <div className="details-row">
              <div className="details-row-title">Conditional:</div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="value-selector"
              >
                <select
                  value={action.conditionalType || "equals"}
                  onChange={(e) => this.onConditionalTypeChange(e.target.value)}
                  className="conditional-type-select"
                >
                  <option value="equals">Equals (==)</option>
                  <option value="notEquals">Not Equals (!=)</option>
                  <option value="lessThan">Less Than (&lt;)</option>
                  <option value="greaterThan">Greater Than (&gt;)</option>
                  <option value="lessThanOrEqual">
                    Less Than or Equal (&lt;=)
                  </option>
                  <option value="greaterThanOrEqual">
                    Greater Than or Equal (&gt;=)
                  </option>
                  <option value="matchRegex">Match Regex (~=)</option>
                </select>
              </div>
            </div>
            <div className="details-row">
              <div className="details-row-title">Expected value:</div>
              <ValueSelector {...this.props} variableNames={variableNames} />
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    );
  }

  onSelectorChange(newSelector) {
    const { action, parentAction } = this.props;
    action.selector = newSelector;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }

  onConditionalTypeChange(newType) {
    const { action, parentAction } = this.props;
    action.conditionalType = newType;

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }
}

export default VarAssertConditionActionItem;
