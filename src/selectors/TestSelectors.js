export const buildTestsIdMap = (tests) => {

  var map = {};

  tests.forEach((test) => {
    map[test.testId] = test;
  });

  return map;

};