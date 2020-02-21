import React from 'react'
import QuickActions from '../QuickActions';
import DetailsSectionWrapper from '../DetailsSectionWrapper'
import ActionSelector from '../ActionSelector'
import DescriptionSelector from '../DescriptionSelector'
import ActDesToggle from '../ActDesToggle'
import {EditableLabel} from '../../../../component'
import Message from '../../../../util/Message'

class CSVInsertRowActionItem extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isHovered: false
    }

  }

  render() {

    const { action, isExpanded, showComment, userSettings, activeTest } = this.props;
    const variableNames = activeTest ? activeTest.variables.map((variable) => ("${" + variable.name + "}")) : [];

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
            <div className="grid-item grid-row grid-column">
              <div className="grid-row v-align">
                <div className="ai-value-label ">CSV Name:</div>
                <div className="value-tag">
                  <EditableLabel value={action.csvName}
                                 highlight={["${random}", "${random1}", "${random2}", "${random3}", "${default}"].concat(variableNames)}
                                 onChange={(newValue) => this.onCsvNameChange(newValue)}/>
                </div>
              </div>
            </div>
          ])}
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
        {(isExpanded) && (
          <DetailsSectionWrapper {...this.props}
                                 userSettings={this.props.userSettings}
                                 hideTimeout
                                 hideContinueOnFail >
            <div className="grid-row grid-column csv-insert-columns">
              {action.columns.map((column, idx) => (
                <div className="grid-row csv-insert-column">
                  <div className="grid-item grid-row grid-column value-column">
                    <div>column name:</div>
                    <div className="grid-row">
                      <div className="value-tag">
                        <EditableLabel value={column.columnName}
                                       highlight={["${random}", "${random1}", "${random2}", "${random3}", "${default}"].concat(variableNames)}
                                       onChange={(newValue) => this.onColumnChange(idx, {key: "columnName", value: newValue})}/>
                      </div>
                    </div>
                  </div>
                  <div className="grid-item-2 grid-row grid-column value-column">
                    <div>CSS Selector:</div>
                    <div className="grid-row">
                      <div className="value-tag">
                        <EditableLabel value={column.selector}
                                       highlight={["${random}", "${random1}", "${random2}", "${random3}", "${default}"].concat(variableNames)}
                                       onChange={(newValue) => this.onColumnChange(idx, {key: "selector", value: newValue})}/>
                      </div>
                    </div>
                  </div>
                  <div className="grid-item grid-row grid-column value-column">
                    <div>El's variable:</div>
                    <div className="grid-row">
                      <div className="value-tag">
                        <EditableLabel value={column.select}
                                       highlight={["${random}", "${random1}", "${random2}", "${random3}", "${default}"].concat(variableNames)}
                                       onChange={(newValue) => this.onColumnChange(idx, {key: "select", value: newValue})}/>
                      </div>
                    </div>
                  </div>
                  <div className="column-actions">
                    <div title="remove column" onClick={() => this.removeRow(idx)}>-</div>
                    <div title="add column" onClick={() => this.addRow(idx)}>+</div>
                    <div title="shift column up" onClick={() => this.shiftUp(idx)}>{String.fromCharCode(11014)}</div>
                    <div title="shift column down" onClick={() => this.shiftDown(idx)}>{String.fromCharCode(11015)}</div>
                  </div>
                </div>
              ))}
            </div>
          </DetailsSectionWrapper>
        )}
      </div>
    )
  }

  onColumnChange(idx, change) {
    const { action } = this.props;
    action.columns[idx][change.key] = change.value;
    this.updateAction([{key: "columns", value: action.columns}]);
  }

  shiftUp(idx) {

    const { action } = this.props;

    var columns = action.columns;
    var currentIdx = idx;
    var targetIdx = idx - 1;

    if (targetIdx !== -1) {

      var selectorToSwap = columns[targetIdx];
      columns[targetIdx] = columns[currentIdx];
      columns[currentIdx] = selectorToSwap;
    }

    this.updateAction([{key: "columns", value: columns}]);

  }

  shiftDown(idx) {

    const { action } = this.props;

    var columns = action.columns;
    var currentIdx = idx;
    var targetIdx = idx + 1;

    if (targetIdx < columns.length) {

      var selectorToSwap = columns[targetIdx];
      columns[targetIdx] = columns[currentIdx];
      columns[currentIdx] = selectorToSwap;
    }

    this.updateAction([{key: "columns", value: columns}]);

  }

  removeRow(idx) {
    const { action } = this.props;
    action.columns.splice(idx, 1);
    this.updateAction([{key: "columns", value: action.columns}]);
  }

  addRow(idx) {
    const { action } = this.props;
    action.columns.splice(idx + 1, 0, {columnName: "Name", selector: ".classname", select: "innerHTML"});
    this.updateAction([{key: "columns", value: action.columns}]);
  }

  onCsvNameChange(newName) {
    this.updateAction([{key: "csvName", value: newName}]);
  }

  updateAction(changes) {

    const { action, parentAction } = this.props;

    changes.forEach((change) => {
      action[change.key] = change.value;
    });

    if (parentAction) {
      parentAction.value = action;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }

}


export default CSVInsertRowActionItem;
