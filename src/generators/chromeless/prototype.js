var beautify = require('js-beautify').js_beautify
var varname = require('varname');
var util = require("../_shared/util");
var generateActionList = require('../_shared/chromeless/generateActionListSimple').generateActionList;

/* entry point from the extension */
export function generate(test, components) {

  var actions = test.actions;
  var testName = test.name;
  var generatedCode = generateActionList(actions, components);
  var generatedCompCode = "";
  var defaultLaunchUrlInfo = util.getDefaultLaunchUrlInfo(actions);

  components.forEach((component) => {

    var actionListCode = generateActionList(component.actions, components);
    var cArguments = util.getKeyParamsForComponent(component);

    generatedCompCode += `
    
    browser.components.${varname.camelback(component.name)} = function(${util.buildParamStringFromArray(cArguments)}) {
      return browser${actionListCode}
    };`;

  });


  var code = ` 
      await chromeless${generatedCode}
`;

  return beautify(code, { indent_size: 2 });

}
