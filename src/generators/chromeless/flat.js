var beautify = require('js-beautify').js_beautify
var varname = require('varname');
var util = require("../_shared/util");
var generateActionList = require('../_shared/chromeless/generateActionList').generateActionList;
var shimTemplate = require("ejs-loader!../_shared/chromeless/assets/chromeless-shims.ejs");

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
      const { Chromeless } = require('chromeless')
      
      /* Test: ${testName.replace(/['"]/g, "")} */
      
      async function run() {
        
        const baseUrl = "${defaultLaunchUrlInfo.launchUrl}";
        const chromeless = new Chromeless()
        bindShims(chromeless);
        
        await chromeless${generatedCode}

        await chromeless.end();   
        
      };
      
      run().catch(console.error.bind(console))
      
      /* Custom SnapTest command library: */
      
      const TIMEOUT = 10000; 
      const random = "" + parseInt(Math.random() * 1000000);
      const random1 = "" + parseInt(Math.random() * 1000000);
      const random2 = "" + parseInt(Math.random() * 1000000);
      const random3 = "" + parseInt(Math.random() * 1000000);
      
      ${shimTemplate({ extension: true, cli: false })}
      
`;

  return beautify(code, { indent_size: 2 });

}


