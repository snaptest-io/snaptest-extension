var beautify = require('js-beautify').js_beautify;
import _ from 'lodash';
var varname = require('varname');
var util = require("../_shared/util");
var generateActionList = require('../_shared/nightwatch/generateActionList').generateActionList;

/* entry point from the extension */
export function generate(test, components) {
  return ""
}


function defineTestVariables(test) {

  var variableDefs = "";

  test.variables.forEach((variable) => {
    if (variable.name !== "baseUrl") {
      variableDefs += `const ${variable.name} = \`${variable.defaultValue}\`;`;
    }
  });

  return variableDefs;
}