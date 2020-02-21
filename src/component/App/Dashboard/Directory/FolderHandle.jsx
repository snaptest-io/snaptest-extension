import React from 'react'
import { DragSource } from 'react-dnd';
import FolderHandleMonitor from './FolderHandleMonitor'
import {endDrag} from './DragUtils'
import ClassNames from 'classnames'
import Message from '../../../../util/Message'
import {EditableLabel, Dropdown} from '../../../../component'
import {countNodesChildren, walkThroughTreeNodes, walkUpAncestors} from '../../../../util/treeUtils'
import ReactTooltip from 'simple-react-tooltip'
import Route from '../../../../models/Route'

class FolderHandle extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { connectDragSource, isDragging, node, isOpen, premium, connectDragPreview} = this.props;
    const dirItemClassNames = ClassNames("dir-folder", {dragging: isDragging});
    const {testCount, compCount} = this.countNodesTests(node);

    return (
      <FolderHandleMonitor nodeId={node.id} className="dir-folder-handle">
        <div className={dirItemClassNames}>
          {connectDragPreview(
          <div className="grid-item">
            <div className="grid-row v-align">
              {connectDragSource(
                <div>
                  {isOpen ? (
                    <svg onClick={() => this.onToggleFolder()} className="folder-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 9c0-.55-.45-1-1-1H5c-.43 0-.79.27-.93.65h-.01l-3 8h.01c-.04.11-.07.23-.07.35 0 .55.45 1 1 1h14c.43 0 .79-.27.93-.65h.01l3-8h-.01c.04-.11.07-.23.07-.35zM3.07 7.63C3.22 7.26 3.58 7 4 7h14V5c0-.55-.45-1-1-1H8.41l-1.7-1.71A.997.997 0 0 0 6 2H1c-.55 0-1 .45-1 1v12.31l3.07-7.68z" id="folder_open_1_"/></svg>
                  ) : (
                    <svg onClick={() => this.onToggleFolder()} className="folder-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 17c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7H0v10zM19 4H9.41l-1.7-1.71A.997.997 0 0 0 7 2H1c-.55 0-1 .45-1 1v3h20V5c0-.55-.45-1-1-1z" id="folder_close_1_"/></svg>
                  )}
                </div>
              )}
              <div className="grid-row grid-column" onClick={() => this.onToggleFolder()}>
                <EditableLabel value={node.module}
                               size={node.module && node.module.length}
                               onChange={(newValue) => this.onChangeTestFolderName(node, newValue)}
                               doubleClickEdit={false}/>
                <div className="folder-item-count">{`(${testCount} test${(testCount === 1 ) ? "" : "s"}, ${compCount} comp${(compCount === 1 ) ? "" : "s"})`}</div>
              </div>
              <div className="grid-item"></div>
            </div>
          </div>
          )}
          <div className="dir-row-buttons quick-button-dd" onClick={(e) => e.stopPropagation()}>
            <button className="quick-button" title="Play folder" onClick={(e) => this.onFolderPlayback(node)}>
              <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z"/></svg>
            </button>
            <Dropdown classNames="quick-button-dd test-move-dd" button={
              <button className="quick-button">
                <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 6h18c.55 0 1-.45 1-1s-.45-1-1-1H1c-.55 0-1 .45-1 1s.45 1 1 1zm18 3H1c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1zm0 5H1c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
              </button>
            }>
              <div>
                <div className="dd-header">Test options:</div>
                <div className="dd-item"
                     onClick={(e) => this.onViewFolderCode(node.id)} >
                  <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 6a1.003 1.003 0 0 0-1.71-.71l-4 4C.11 9.47 0 9.72 0 10c0 .28.11.53.29.71l4 4a1.003 1.003 0 0 0 1.42-1.42L2.41 10 5.7 6.71c.19-.18.3-.43.3-.71zm6-4c-.46 0-.83.31-.95.73l-4 14c-.02.09-.05.17-.05.27 0 .55.45 1 1 1 .46 0 .83-.31.95-.73l4-14c.02-.09.05-.17.05-.27 0-.55-.45-1-1-1zm7.71 7.29l-4-4a1.003 1.003 0 0 0-1.42 1.42l3.3 3.29-3.29 3.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l4-4c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71z"/></svg>
                  View Code
                </div>
                {premium && (
                  <div className="dd-item"
                       onClick={(e) => {this.onMoveTests()}} >
                    <svg className="svg-icon"  viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.71 9.29l-6-6a1.003 1.003 0 0 0-1.42 1.42L15.59 9H2c-.55 0-1 .45-1 1s.45 1 1 1h13.59l-4.29 4.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l6-6c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71z"/></svg>
                    Copy Folder to...
                  </div>
                )}
                <div className="dd-item dd-warn"
                     onClick={(e) => {this.onDeleteTestFolder(node)}}>
                  <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 1h-5c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1H3c-.55 0-1 .45-1 1v1h16V2c0-.55-.45-1-1-1zm.5 3h-15c-.28 0-.5.22-.5.5s.22.5.5.5H3v14c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5h.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zM7 16c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8zm4 0c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8zm4 0c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8z"/></svg>
                  Archive
                </div>
              </div>
            </Dropdown>
          </div>
          <ReactTooltip id='folder-handle' place="left" type="dark" effect="solid" />
        </div>
      </FolderHandleMonitor>
    )

  }

  countNodesTests(node) {

    var testCount = 0;
    var compCount = 0;

    walkThroughTreeNodes(node, (_node) => {
      if (node !== _node && (_node.type && _node.type === "test")) {
        testCount++;
      }
      if (node !== _node && (_node.type && _node.type === "component")) {
        compCount++;
      }
    });

    return {
      testCount,
      compCount
    }

  }

  onMoveTests() {
    const { node } = this.props;
    Message.to(Message.SESSION, "setModal", {name: "move-folder", meta: {nodeId: node.id}});
  }

  onFolderPlayback(folderNode) {

    const { directory, testFilters } = this.props;

    var testsToRun = [];
    var folderString = "";

    if (folderNode) {
      walkThroughTreeNodes(folderNode, (node) => {
        if (node.type === "test") testsToRun.push(node.testId);
      });

      folderString = folderNode.module;

      walkUpAncestors(directory.tree, folderNode.id, (node) => {
        if (node.module !== "Tests") folderString = node.module + " > " + folderString;
      });

      folderString = "(folder) " + folderString;

    } else {
      walkThroughTreeNodes(directory.tree, (node) => {
        if (node.type === "test") testsToRun.push(node.testId);
      });
    }

    if (testFilters.filtered) {
      testsToRun = testsToRun.filter((testId) => testFilters.testIds.indexOf(testId) !== -1)
    }

    Message.to(Message.SESSION, "pushRoute", new Route("multiplayback", {testsToRun, folderString, folderNodeId: folderNode.id}));


  }

  onViewFolderCode(folderId) {
    Message.to(Message.SESSION, "setFolderActive", folderId);
    Message.to(Message.SESSION, "pushRoute", new Route("codeviewer" ) );
  }

  onDeleteTestFolder(node) {

    if (countNodesChildren(node) === 0) {
      Message.to(Message.SESSION, "removeFolder", node.id);
    } else {
      Message.to(Message.SESSION, "setModal", {name: "delete-folder", meta: {nodeId: node.id}});
    }

  }

  onChangeTestFolderName(folderNode, newName) {
    Message.to(Message.SESSION, "changeTestFolderName", {id: folderNode.id, name: newName});
    this.forceUpdate();
  }


  onToggleFolder() {
    const { node } = this.props;
    Message.to(Message.SESSION, "toggleFolder", node.id);
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

export default DragSource("ROW", testSource, collect)(FolderHandle);
