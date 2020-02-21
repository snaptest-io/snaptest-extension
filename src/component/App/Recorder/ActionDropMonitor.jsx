import React from 'react'
import _ from 'lodash'
import { DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom';

import ClassNames from 'classnames'

const target = {
  drop(props) {
    return {
      actionId: props.actionId, // this will be passed to the "endDrag" method of a DragSource
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

class ActionDropMonitor extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { connectDropTarget, isOver, className, onClick = _.noop } = this.props;
    const classNames = ClassNames(className, "action-drop-monitor", {hovered: isOver});

    return connectDropTarget(
      <div className={classNames} onClick={(e) => onClick(e)}>
        {this.props.children}
      </div>
    );

  }

}

export default DropTarget("ACTION", target, collect)(ActionDropMonitor);

