import React from 'react'
import _ from 'lodash'
import { DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom';

import ClassNames from 'classnames'

const squareTarget = {
  drop(props, monitor, component) {
    return {
      nodeId: props.nodeId, // this will be passed to the "endDrag" method of a DragSource
      location: component.state.portionHovered
    }
  },
  hover(props,monitor,component) {

    var domNode = findDOMNode(component);
    var yPosition = monitor.getClientOffset().y-domNode.getBoundingClientRect().top;

    var thirdOfHeight = domNode.clientHeight / 4;

    if (props.alwaysCenter) {
      component.setState({ portionHovered: "center" });
    } else if (yPosition < thirdOfHeight) {
      component.setState({ portionHovered: "above" });
    }
    else if (yPosition > thirdOfHeight * 2.5) {
      component.setState({ portionHovered: "below" });
    }
    else {
      component.setState({ portionHovered: "center" });
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

class FolderHandleMonitor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      portionHovered: "center" // can be "above", "below", or "center"
    }

  }

  render() {

    const { connectDropTarget, isOver, className, onClick = _.noop } = this.props;
    const { portionHovered } = this.state;
    const classNames = ClassNames(className, portionHovered, {hovered: isOver});

    return connectDropTarget(
      <div className={classNames} onClick={(e) => onClick(e)}>
        {this.props.children}
      </div>
    );

  }

}

export default DropTarget("ROW", squareTarget, collect)(FolderHandleMonitor);

