import React from 'react'
import Message from '../../util/Message'
import classNames from 'classnames';

var minWidth = 60;
var minHeight = 40;
var MARGINS = 10;
var preSnapped;
var clicked = null;
var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;
var rightScreenEdge, bottomScreenEdge;
var bound, x, y;
var redraw = false;
var pane;
var e;
var viewMode;

class Window extends React.Component {

  constructor(props) {
    super(props);

    if (props.disableResize) MARGINS = 0;

  }

  setupDragAndResize() {

     pane = this.refs.pane;
     pane.addEventListener('mousedown', this.onMouseDown);
     document.addEventListener('mousemove', this.onMove);
     document.addEventListener('mouseup', this.onUp);

    animate();

  }

  tearDownDragAndResize() {
    pane = this.refs.pane;
    pane.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseup', this.onUp);
    pane.style.cursor = 'default';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewMode === "window" && this.props.viewMode !== "window") {
      viewMode = "window";
      this.setupDragAndResize();
    }

    if (nextProps.viewMode !== "window" && this.props.viewMode === "window") {
      viewMode = "";
      this.tearDownDragAndResize();
    }
  }

  componentWillUnmount() {
    viewMode = "";
    this.tearDownDragAndResize();
  }

  onMouseDown(e) {

    calc(e);

    var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

    clicked = {
      x: x,
      y: y,
      cx: e.clientX,
      cy: e.clientY,
      w: bound.width,
      h: bound.height,
      isResizing: isResizing,
      isMoving: !isResizing && canMove(),
      onTopEdge: onTopEdge,
      onLeftEdge: onLeftEdge,
      onRightEdge: onRightEdge,
      onBottomEdge: onBottomEdge
    };

  }

  onUp(e) {

    var changed = calc(e);

    if (changed) {
      Message.to(Message.SESSION, "setViewModeWindowAttr", {
        viewX: pane.style.left,
        viewY: pane.style.top
      });
    }

    clicked = null;

  }

  onMove(_e) {
    calc(_e);
    e = _e;
    redraw = true;
  }

  componentDidMount() {
     if (this.props.viewMode === "window") {
       this.setupDragAndResize();
       viewMode = "window";
     }
  }

  render() {

    const { viewMode, children, isRecording, isAssertMode, showHotkeys, minimized } = this.props;
    const viewHotkeyMode = showHotkeys ? " show-hotkeys " : "";

    var windowClasses = classNames({
      "window": true,
      "control-panel": true,
      "is-recording": isRecording || isAssertMode,
      "show-hotkeys": showHotkeys,
      "minimized": minimized
    });

    return (minimized ? (
      <div className={windowClasses} style={this.getWindowStyles()} ref="pane" onClick={() => this.onWindowClick() }></div>
    ) : (
      <div className={windowClasses + " " + viewMode } style={this.getWindowStyles()} ref="pane" onClick={() => this.onWindowClick() }>
        {children}
      </div>
    ))

  }

  onWindowClick() {

    const {minimized} = this.props;

    if (minimized) {
      Message.to(Message.SESSION, "setMinimized", false)
    }

  }

  getWindowStyles() {

    const { viewX, viewY } = this.props;

    return {
      top: viewY,
      left: viewX,
      width: 230,
      height: 25
    };
  }

}

function setBounds(element, x, y, w, h) {
  element.style.left = x + 'px';
  element.style.top = y + 'px';
  element.style.width = w + 'px';
  element.style.height = h + 'px';
}

function calc(e) {

  bound = pane.getBoundingClientRect();

  if (e.clientX - bound.left !== x || e.clientY - bound.top !== y) {
    x = e.clientX - bound.left;
    y = e.clientY - bound.top;

    onTopEdge = y < MARGINS;
    onLeftEdge = x < MARGINS;
    onRightEdge = x >= bound.width - MARGINS;
    onBottomEdge = y >= bound.height - MARGINS;

    rightScreenEdge = window.innerWidth - MARGINS;
    bottomScreenEdge = window.innerHeight - MARGINS;

    return true;
  }

  else return false;

}

function canMove() {
  return x > 0 && x < bound.width && y > 0 && y < bound.height
      && y < 30;
}

function animate() {

  // if (viewMode === "window") {
    requestAnimationFrame(animate);
  // }

  if (!redraw) return;

  redraw = false;

  if (clicked && clicked.isResizing) {

    if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
    if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

    if (clicked.onLeftEdge) {
      var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
      if (currentWidth > minWidth) {
        pane.style.width = currentWidth + 'px';
        pane.style.left = e.clientX + 'px';
      }
    }

    if (clicked.onTopEdge) {
      var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
      if (currentHeight > minHeight) {
        pane.style.height = currentHeight + 'px';
        pane.style.top = e.clientY + 'px';
      }
    }

    return;
  }

  if (clicked && clicked.isMoving) {

    if (preSnapped) {
      setBounds(pane,
          e.clientX - preSnapped.width / 2,
          e.clientY - Math.min(clicked.y, preSnapped.height),
          preSnapped.width,
          preSnapped.height
      );
      return;
    }

    // moving
    pane.style.top = (e.clientY - clicked.y) + 'px';
    pane.style.left = (e.clientX - clicked.x) + 'px';

    return;
  }

  // This code executes when mouse moves without clicking

  // style cursor
  if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
    pane.style.cursor = 'nwse-resize';
  } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
    pane.style.cursor = 'nesw-resize';
  } else if (onRightEdge || onLeftEdge) {
    pane.style.cursor = 'ew-resize';
  } else if (onBottomEdge || onTopEdge) {
    pane.style.cursor = 'ns-resize';
  } else if (canMove()) {
    pane.style.cursor = 'move';
  } else {
    pane.style.cursor = 'default';
  }
}

export default Window;