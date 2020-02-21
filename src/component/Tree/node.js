'use strict';

var cx = require('classnames');
var React = require('react');
var ReactDOM = require('react-dom');

var Node = React.createClass({
  displayName: 'UITreeNode',

  renderCollapse: function renderCollapse() {
    var index = this.props.index;

    if (index.id === 1) return null;  // don't show down arrow on root node.

    if (index.node && !index.node.leaf) {
      var collapsed = index.node.collapsed;

      return React.createElement('span', {
        className: cx('collapse', collapsed ? 'caret-right' : 'caret-down'),
        onMouseDown: function onMouseDown(e) {
          e.stopPropagation();
        },
        onClick: this.handleCollapse });
    }

    return null;
  },
  renderChildren: function renderChildren() {
    var _this = this;

    var index = this.props.index;
    var tree = this.props.tree;
    var dragging = this.props.dragging;

    if (index.children && index.children.length) {
      var childrenStyles = {};
      if (index.node.collapsed) childrenStyles.display = 'none';
      childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

      return React.createElement(
        'div',
        { className: 'children', style: childrenStyles },
        index.children.map(function (child) {
          var childIndex = tree.getIndex(child);
          return React.createElement(Node, {
            tree: tree,
            index: childIndex,
            key: childIndex.id,
            dragging: dragging,
            paddingLeft: _this.props.paddingLeft,
            onCollapse: _this.props.onCollapse,
            onDragStart: _this.props.onDragStart
          });
        })
      );
    }

    return null;
  },
  render: function render() {
    var tree = this.props.tree;
    var index = this.props.index;
    var dragging = this.props.dragging;
    var node = index.node;
    var styles = {};

    return React.createElement(
      'div',
      { className: cx('m-node', {
          'placeholder': index.id === dragging
        }), style: styles },
      React.createElement(
        'div',
        { className: 'inner', ref: 'inner', onMouseDown: this.handleMouseDown },
        this.renderCollapse(),
        tree.renderNode(node)
      ),
      this.renderChildren()
    );
  },
  handleCollapse: function handleCollapse(e) {
    e.stopPropagation();
    var nodeId = this.props.index.id;
    if (this.props.onCollapse) this.props.onCollapse(nodeId);
  },
  handleMouseDown: function handleMouseDown(e) {
    var nodeId = this.props.index.id;
    var dom = this.refs.inner;

    if (nodeId === 1) return;

    if (this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }
});

module.exports = Node;