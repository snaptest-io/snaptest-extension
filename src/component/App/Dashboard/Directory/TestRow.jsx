import React from 'react'
import { DragSource } from 'react-dnd';
import RowMonitor from './RowMonitor'
import {endDrag} from './DragUtils'
import ClassNames from 'classnames'
import Message from '../../../../util/Message'
import Route from '../../../../models/Route'
import {EditableLabel, Dropdown} from '../../../../component'

class TestRow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { connectDragSource, connectDragPreview, isDragging, node, test, active = false, premium } = this.props;

    if (!test) return <div></div>;

    const dirItemClassNames = ClassNames("dir-item", {
      "dir-test": test.type === "test",
      "dir-request": test.type === "request",
      // active: active,
      dragging: isDragging
    });

    const clickHandleClassnames = ClassNames("grid-item click-handle", {
      active: active
    });

    return (
      <RowMonitor nodeId={node.id} className="dir-item-row dir-test-row">
        <div className={dirItemClassNames}>
          {connectDragSource(
            <div className={clickHandleClassnames} onClick={() => this.onViewTest(test)}>
              <div className="square handle">{test.type === "request" ? test.method + " " : ""}{test.type}</div>
              <EditableLabel value={test.name} size={test.name.length}
                             onChange={(newValue) => this.onTestNameChange(newValue, test)} doubleClickEdit={false}
                             link />
              <div className="grid-item"></div>
            </div>
          )}
          <div className="dir-row-buttons quick-button-dd" onClick={(e) => e.stopPropagation()}>
            <Dropdown classNames="quick-button-dd test-move-dd" button={
              <button className="quick-button">
                <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 6h18c.55 0 1-.45 1-1s-.45-1-1-1H1c-.55 0-1 .45-1 1s.45 1 1 1zm18 3H1c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1zm0 5H1c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
              </button>
            }>
              <div>
                <div className="dd-header">Test options:</div>
                <div className="dd-item"
                     onClick={(e) => {this.onDuplicateTest(test)}}>
                  <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 4H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zm-1 14H2V6h12v12zm5-18H5c-.55 0-1 .45-1 1v2h2V2h12v12h-1v2h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"/></svg>
                  Duplicate
                </div>
                {premium && (
                  <div className="dd-item"
                       onClick={(e) => {this.onMoveTest(test)}} >
                    <svg className="svg-icon"  viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.71 9.29l-6-6a1.003 1.003 0 0 0-1.42 1.42L15.59 9H2c-.55 0-1 .45-1 1s.45 1 1 1h13.59l-4.29 4.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l6-6c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71z"/></svg>
                    Copy Test to...
                  </div>
                )}
                <div className="dd-item dd-warn"
                     onClick={(e) => {this.onDeleteTest(test)}}>
                  <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 1h-5c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1H3c-.55 0-1 .45-1 1v1h16V2c0-.55-.45-1-1-1zm.5 3h-15c-.28 0-.5.22-.5.5s.22.5.5.5H3v14c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5h.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zM7 16c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8zm4 0c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8zm4 0c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8z"/></svg>
                  Archive
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </RowMonitor>
    )
  }

  onMoveTest(test) {
    Message.to(Message.SESSION, "setModal", {name: "move-folder", meta: {testId: test.id}});
  }

  onTestNameChange(newValue, test) {
    Message.to(Message.SESSION, "setTestName", {id: test.id, value: newValue})
  }

  onDuplicateTest(test) {
    Message.to(Message.SESSION, "duplicateTest", test);
  }

  onDeleteTest(test) {
    if ((test.actions && test.actions.length === 0) || confirm(`Are you sure you want to archive this ${test.type}?`)) {
      Message.to(Message.SESSION, "deleteTest", test.id);
    }
  }

  onViewTest(test) {
    if (test.type === "test") {
      Message.to(Message.SESSION, "setTestActive", test.id);
      Message.to(Message.SESSION, "newRouteStack", new Route("testbuilder", { testId: test.id } ) );
      // Message.to(Message.SESSION, "pushRoute", new Route("testbuilder", { testId: test.id, reset: true } ) );
    } else {
      Message.to(Message.SESSION, "setTestActive", test.id);
      Message.to(Message.SESSION, "pushRoute", new Route("requestbuilder", { testId: test.id, reset: true } ) );
    }
  }

  onRunTest(test) {

    const { primaryTabId, currentTabId } = this.props;

    if (currentTabId !== primaryTabId) {
      Message.to(Message.SESSION, "setActiveTabAlert", true);
    } else {
      Message.to(Message.SESSION, "setTestActive", test.id);
      Message.to(Message.SESSION, "pushRoute", new Route("testbuilder", { testId: test.id } ) );
      Message.promise("startActiveTestPlayback");
    }

  }

}

const testSource = {
  beginDrag(props) {
    return {
      nodeId: props.node.id
    };
  },
  endDrag
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default DragSource("ROW", testSource, collect)(TestRow);
