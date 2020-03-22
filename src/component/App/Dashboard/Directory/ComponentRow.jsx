import React from 'react'
import { DragSource } from 'react-dnd';
import RowMonitor from './RowMonitor'
import {endDrag} from './DragUtils'
import ClassNames from 'classnames'
import Message from '../../../../util/Message'
import Route from '../../../../models/Route'
import {Dropdown, EditableLabel} from '../../../../component'

class ComponentRow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { connectDragSource, node, isDragging, component, connectDragPreview, active = false, compInstanceSummary } = this.props;

    if (!component) return <div></div>;

    const instanceSummary = compInstanceSummary[component.id] || { tests: [], count: 0 };

    const dirItemClassNames = ClassNames("dir-item dir-comp", {
      dragging: isDragging
    });

    const clickHandleClassnames = ClassNames("grid-item click-handle", {
      active: active
    });

    return (
      <RowMonitor nodeId={node.id} className="dir-item-row dir-test-row">
          <div className={dirItemClassNames}>
            {connectDragSource(
              <div className={clickHandleClassnames} onClick={() => this.onView(component)}>
                {connectDragPreview(
                  <div className="square handle">comp</div>
                )}
                <EditableLabel value={component.name} size={component.name.length}
                               onChange={(newValue) => this.onTestNameChange(newValue, component)} doubleClickEdit={false}
                               link />
                <div className="grid-item"></div>
              </div>
            )}
            <div>
              {instanceSummary.count > 0 ? (
                <Dropdown classNames="quick-button-dd test-move-dd" button={
                  <button className="text-pill hoverable">
                    {`in ${instanceSummary.tests.length} test${instanceSummary.tests.length > 1 ? "s" : ""} (${instanceSummary.count}x)`}
                  </button>
                }>
                  <div>
                    <div className="dd-header">Test with instances:</div>
                    {instanceSummary.tests.map((testInstance) =>
                      <div className="dd-item"
                           onClick={() => {this.onView(testInstance)}}>
                        <svg className="svg-icon" viewBox="0 0 20 20"><path d="M10.01 7.984A2.008 2.008 0 008.012 9.99c0 1.103.9 2.006 1.998 2.006a2.008 2.008 0 001.998-2.006c0-1.103-.9-2.006-1.998-2.006zM20 9.96v-.03-.01-.02-.02a.827.827 0 00-.21-.442c-.64-.802-1.398-1.514-2.168-2.166-1.658-1.404-3.566-2.587-5.664-3.058a8.982 8.982 0 00-3.656-.05c-1.11.2-2.178.641-3.177 1.183-1.569.852-2.997 2.016-4.246 3.33-.23.25-.46.49-.67.761-.279.351-.279.773 0 1.124.64.802 1.4 1.514 2.169 2.166 1.658 1.404 3.566 2.577 5.664 3.058 1.209.271 2.438.281 3.656.05 1.11-.21 2.178-.651 3.177-1.193 1.569-.852 2.997-2.016 4.246-3.33.23-.24.46-.49.67-.751.11-.12.179-.271.209-.442v-.02-.02-.01-.03V10v-.04zM10.01 14A4.003 4.003 0 016.014 9.99a4.003 4.003 0 013.996-4.011 4.003 4.003 0 013.996 4.011 4.003 4.003 0 01-3.996 4.011z" fill-rule="nonzero"/></svg>
                        ({testInstance.count}x) {testInstance.name}
                      </div>
                    )}
                  </div>
                </Dropdown>
              ) : (
                <button className="text-pill">
                  {`not used`}
                </button>
              )}
            </div>
            <div className="dir-row-buttons quick-button-dd" onClick={(e) => e.stopPropagation()}>
              <Dropdown classNames="quick-button-dd test-move-dd" button={
                <button className="quick-button">
                  <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 6h18c.55 0 1-.45 1-1s-.45-1-1-1H1c-.55 0-1 .45-1 1s.45 1 1 1zm18 3H1c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1zm0 5H1c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
                </button>
              }>
                <div>
                  <div className="dd-header">Test options:</div>
                  <div className="dd-item"
                       onClick={(e) => {this.onDuplicateTest(component)}}>
                    <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 4H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zm-1 14H2V6h12v12zm5-18H5c-.55 0-1 .45-1 1v2h2V2h12v12h-1v2h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"/></svg>
                    Duplicate
                  </div>
                  <div className="dd-item dd-warn"
                       onClick={(e) => {this.onDelete(component)}}>
                    <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 1h-5c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1H3c-.55 0-1 .45-1 1v1h16V2c0-.55-.45-1-1-1zm.5 3h-15c-.28 0-.5.22-.5.5s.22.5.5.5H3v14c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5h.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zM7 16c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8zm4 0c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8zm4 0c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8z"/></svg>
                    Archive
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
      </RowMonitor>
    );
  }

  onCopyTest(test, destination) {
    Message.to(Message.SESSION, "copyTestTo", {destination, testId: test.id});
  }

  onDuplicateTest(test) {
    Message.to(Message.SESSION, "duplicateTest", test);
  }

  onDelete(component) {
    // check for component to be in a test

    const { tests } = this.props;

    var testsWithComp = [];

    tests.forEach((test) => {
      if (test.type === "test") {
        test.actions.forEach((action) => {
          if (action.componentId === component.id && testsWithComp.indexOf(test.id) === -1) {
            testsWithComp.push(test);
          }
        })
      }
    });

    if (testsWithComp.length === 0) {
      Message.to(Message.SESSION, "deleteComponent", component.id, () => this.forceUpdate());
    } else {
      var testNames = testsWithComp.map((test) => (test.name));

      if (confirm("Are you sure? This component is in: " + testNames.join(", "))) {
        Message.to(Message.SESSION, "deleteComponent", component.id, () => this.forceUpdate());
      }

    }

  }

  onTestNameChange(newValue, comp) {
    comp.name = newValue;
    Message.to(Message.SESSION, "updateComponent", comp);
  }

  onView(test) {
    if (test.type === "test") {
      Message.to(Message.SESSION, "setTestActive", test.id);
      Message.to(Message.SESSION, "newRouteStack", new Route("testbuilder", { testId: test.id } ) );
    } else if (test.type === "component") {
      Message.to(Message.SESSION, "setComponentActive", test.id);
      Message.to(Message.SESSION, "newRouteStack", new Route("componentbuilder", { componentId: test.id } ) );
    } else {
      Message.to(Message.SESSION, "setTestActive", test.id);
      Message.to(Message.SESSION, "pushRoute", new Route("requestbuilder", { testId: test.id, reset: true } ) );
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
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  };
}

export default DragSource("ROW", testSource, collect)(ComponentRow);
