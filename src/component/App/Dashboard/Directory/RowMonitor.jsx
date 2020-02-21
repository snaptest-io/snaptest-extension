import React from 'react'
import _ from 'lodash'
import { DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom';

import ClassNames from 'classnames'

const squareTarget = {
  drop(props,monitor,component) {
    return {
      nodeId: props.nodeId, // this will be passed to the "endDrag" method of a DragSource
      location: component.state.topHalfHovered ? "above" : "below"
    }
  },
  hover(props,monitor,component) {

    var domNode = findDOMNode(component);
    var yPosition = monitor.getClientOffset().y-domNode.getBoundingClientRect().top;

    if (yPosition < (domNode.clientHeight / 2)) {
      component.setState({ topHalfHovered: true });
    } else {
      component.setState({ topHalfHovered: false });
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

class RowMonitor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      topHalfHovered: false
    }

  }

  render() {

    const { connectDropTarget, isOver, className, onClick = _.noop } = this.props;
    const { topHalfHovered } = this.state;
    const classNames = ClassNames(className, {hovered: isOver, "top-half-hovered": topHalfHovered});

    return connectDropTarget(
      <div className={classNames} onClick={(e) => onClick(e)}>
        {this.props.children}
      </div>
    );

  }

}

export default DropTarget("ROW", squareTarget, collect)(RowMonitor);

