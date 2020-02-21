var beautify = require('js-beautify').js_beautify;
import _ from 'lodash';
var varname = require('varname');
var util = require("../_shared/util");
var generateActionList = require('../_shared/nightwatch/generateActionList').generateActionList;
var driverTemplate = require("ejs-loader!../_shared/nightwatch/assets/snaptest-nw-driver.ejs");

/* entry point from the extension */
export function generate(test, components) {

  if (!test) return "";

  var actions = test.actions;
  var testName = test.name;
  var baseUrlVariable = _.find(test.variables, {name: "baseUrl"});
  var generatedCode = generateActionList(actions, components);
  var generatedCompCode = "";

  components.forEach((component) => {

    var actionListCode = generateActionList(component.actions, components);
    var cArguments = util.getKeyParamsForComponent(component);

    generatedCompCode += `
    
    browser.components.${varname.camelback(component.name)} = function(${util.buildParamStringFromArray(cArguments)}) {
      return browser${actionListCode}
    };`;

  });

  var code = `const TIMEOUT = 10000; 
  const random = "" + parseInt(Math.random() * 1000000);
  const random1 = "" + parseInt(Math.random() * 1000000);
  const random2 = "" + parseInt(Math.random() * 1000000);
  const random3 = "" + parseInt(Math.random() * 1000000);
  
  module.exports = {
      "${testName.replace(/['"]/g, "\\'")}" : function (browser) {
        
        bindHelpers(browser);
        bindComponents(browser);
       
        ${ baseUrlVariable ? (`var baseUrl = browser.launchUrl || \`${baseUrlVariable.defaultValue}\`;`) : ""}
        ${ defineTestVariables(test) }
        
        browser${generatedCode}
          .end();
      }
    };

/*
 * Components 
*/

function bindComponents(browser) {
  
  browser.components = {};
  ${generatedCompCode}
  
}

/*
 * Auto-Generated helper code 
*/

${driverTemplate({ extension: true, cli: false, includeGlobalTimeout: false, globalTimeout: false })}

`;

  return beautify(code, { indent_size: 2 });
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