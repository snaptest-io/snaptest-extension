import _ from 'lodash'
import {walkThroughTreeNodes, walkUpAncestors} from "./treeUtils";

export const hasFiltersApplied = (tagTestFilters) => {
  return tagTestFilters.length > 0;
}

export const getFilteredTestsInfo = (directory, tagTestFilters, testsInTagsMap, filterOperator = "AND") => {

  var testIdsToShow = [];
  var leafNodeIdsToShow = [];
  var nodeIdsToShow = [];

  if (filterOperator === "OR") {
    tagTestFilters.forEach((testTagFilter) => {
      for (var i in testsInTagsMap) {
        if (testsInTagsMap[i].indexOf(testTagFilter) !== -1)
          testIdsToShow.push(i)
      }
    });
  } else {
    // AND functionality
    for (var testId in testsInTagsMap) {

      var testTags = testsInTagsMap[testId];
      var remainingTagIds = tagTestFilters.filter((tagId) => testTags.indexOf(tagId) === -1);

      if (remainingTagIds.length === 0) testIdsToShow.push(testId)

    }
  }

  testIdsToShow = _.uniq(testIdsToShow);

  walkThroughTreeNodes(directory.tree, (node) => {
    if (testIdsToShow.indexOf(node.testId) !== -1) {
      leafNodeIdsToShow.push(node.id);
    }
  });

  var nodeIdsToShow = _.uniq(leafNodeIdsToShow);

  nodeIdsToShow.forEach((nodeId) => {
    walkUpAncestors(directory.tree, nodeId, (node) => {
      if (node.id) nodeIdsToShow.push(node.id);
    });
  });

  nodeIdsToShow = _.uniq(nodeIdsToShow);

  return {
    nodeIds: nodeIdsToShow,
    testIds: testIdsToShow
  }
};