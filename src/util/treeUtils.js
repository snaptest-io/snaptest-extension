import _ from 'lodash';
import deepClone from 'deep-clone'

export function findNodeById(tree, id) {
  var result = null;

  walkThroughTreeNodes(tree, ((node) => {
    if (node.id === id) result = node;
  }))

  return result;

}

export function walkThroughTreeNodes(tree, cb) {

  function _checkChildren(children, parent) {
    if (_.isArray(children)) {
      for (var idx = 0; idx < children.length; idx++) {
        var child = children[idx];
        var shouldBreak = cb(child, parent, idx);
        if (_.isBoolean(shouldBreak) && !shouldBreak) break;
        _checkChildren(child.children, child);
      }
    }
  }

  cb(tree, null, null);

  _checkChildren(tree.children, tree);

}

export function countNodesChildren(node) {
  var amountOfChildren = 0;
  walkThroughTreeNodes(node, (_node) => {
    if (node !== _node) {
      amountOfChildren++;
    }
  });
  return amountOfChildren;
}

export function findNode(tree, qualifier) {

  var result;

  walkThroughTreeNodes(tree, (node) => {
    for (var i in qualifier) {
      if (node[i] === qualifier[i])
        result = node;
    }
  });

  return result;
}

function enhanceTree(tree) {
  walkThroughTreeNodes(tree, (node, parent, idx) => {
    if (idx === 0) {
      node.root = true;
    }
    if (parent) {
      node.parent = parent;
    }
  });
  return tree;
}

export function walkUpAncestors(tree, nodeId, cb) {

  var clonedTree = deepClone(tree);
  enhanceTree(clonedTree);

  var currentNode = findNodeById(clonedTree, nodeId);

  while (currentNode.parent) {
    cb(currentNode.parent);
    currentNode = currentNode.parent;
  }

}

export function getParent(tree, node) {
  var clonedTree = deepClone(tree);
  enhanceTree(clonedTree);

  var node = findNodeById(clonedTree, node.id);

  return node.parent;

}


export function removeNodeFromTree(tree, nodeIdToRemove) {

  walkThroughTreeNodes(tree, (node, parent, idx) => {
    if (node.id === nodeIdToRemove) {
      parent.children.splice(idx, 1);
    }
  });

  return tree;
}

