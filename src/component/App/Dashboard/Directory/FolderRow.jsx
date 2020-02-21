import React from 'react'
import _ from 'lodash'
import { DragSource } from 'react-dnd';
import TestRow from './TestRow'
import ComponentRow from './ComponentRow'
import FolderHandle from './FolderHandle'
import FolderHandleMonitor from './FolderHandleMonitor'

class FolderRow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { node, tests, components, openFolders, testFilters, selectedTestId} = this.props;
    var children = node.children || [];

    return (
      <div className="dir-folder-block">
        {children.length === 0 && (
          <FolderHandleMonitor nodeId={node.id} className="dir-folder-empty" alwaysCenter />
        )}
        { children.map((node) => {

          if (testFilters.filtered && node.id && testFilters.nodeIds.indexOf(node.id) === -1) return null;

          if (node.children || (!node.testId)) {

            var isFolderOpen = openFolders.indexOf(node.id) !== -1;

            return (
              <div className="dir-folder-row">
                <FolderHandle {...this.props} node={node} isOpen={isFolderOpen} testFilters={testFilters}/>
                {isFolderOpen && (
                  <div className="dir-folder-contents">
                    <FolderRow {...this.props} node={node} />
                  </div>
                )}
              </div>);
          } else {
            if (node.type === "component") {
              var component = _.find(components, {id: node.testId});
              return <ComponentRow {...this.props}  node={node} component={component} tests={tests} active={selectedTestId === node.testId}/>
            } else if (node.type === "test" || node.type === "request") {
              var test = _.find(tests, {id: node.testId});
              return <TestRow {...this.props} node={node} test={test} active={selectedTestId === node.testId} />
            }
          }
        })}
      </div>
    );

  }

}
export default FolderRow;
