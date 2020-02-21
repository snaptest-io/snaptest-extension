var Actions = require('../../_shared/ActionConsts');
var util = require('../../_shared/util');
var _ = require('lodash');
var varname = require('varname');

module.exports.generateActionList = function(actions, components) {

  var generatedCode = "";

  actions.forEach((action, idx) => {

    var selector = action.selector
    var selectorType = action.selectorType || "CSS";
    var description = action.description || util.buildActionDescription(action);

    if (action.type === Actions.COMPONENT) {

      var component = _.find(components, {id: action.componentId});
      var params = "";

      if (!component) return;
      else params = util.getValueParamsForComponent(action, component);

      generatedCode += `
      .components.${varname.camelback(component.name)}(${util.buildParamStringFromArray(params)})`;
    }

    if (action.type === Actions.POPSTATE || action.type === Actions.BACK) {
      generatedCode += `
      .back(\`${description}\`)`;
    }

    if (action.type === Actions.FORWARD) {
      generatedCode += `
      .forward(\`${description}\`)`;
    }

    if (action.type === Actions.REFRESH) {
      generatedCode += `
      .refresh(\`${description}\`)`;
    }

    if (action.type === Actions.SCREENSHOT) {
      generatedCode += `
      .saveScreenshot(\`screenshots/${action.value}\`, \`${description}\`)`;
    }

    if (action.type === Actions.MOUSEOVER) {
      generatedCode += `
      .moveToElement(\`${selector}\`, \`${selectorType}\`, 1, 1, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.FOCUS) {
      generatedCode += `
      .focusOnEl(\`${selector}\`, \`${selectorType}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.BLUR) {
      generatedCode += `
      .blurOffEl(\`${selector}\`, \`${selectorType}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.SUBMIT) {
      generatedCode += `
      .formSubmit(\`${selector}\`, \`${selectorType}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.EXECUTE_SCRIPT) {
      generatedCode += `
      .executeScript("${description}", \`${action.script}\`)`;
    }

    if (action.type === Actions.SCROLL_WINDOW) {
      generatedCode += `
      .scrollWindow(${action.x}, ${action.y}, \`${description}\`)`;
    }

    if (action.type === Actions.SCROLL_ELEMENT) {
      generatedCode += `
      .scrollElement(\`${selector}\`, \`${selectorType}\`, ${action.x}, ${action.y}, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.SCROLL_WINDOW_ELEMENT) {
      generatedCode += `
      .scrollWindowToElement(\`${selector}\`, \`${selectorType}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.PAGELOAD || action.type === Actions.PATH_ASSERT) {

      if (action.regex) {
        generatedCode += `
        .pathIs(new RegExp(\`${action.value}\`, "g"), \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
      } else {
        generatedCode += `
        .pathIs(\`${action.value}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
      }

    }

    if (action.type === Actions.FULL_PAGELOAD) {
      generatedCode += `
        .url(\`${action.value}\`, ${action.width}, ${action.height}, \`${description}\`)`;
    }

    if (action.type === Actions.CHANGE_WINDOW || action.type === Actions.CHANGE_WINDOW_AUTO) {
      generatedCode += `
      .switchToWindow(${action.value}, \`${description}\`)`;
    }

    if (action.type === Actions.MOUSEDOWN) {
      generatedCode += `
      .click(\`${selector}\`, \`${selectorType}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.PAUSE) {
      generatedCode += `
      .pause(${action.value})`;
    }

    if (action.type === Actions.EL_PRESENT_ASSERT) {
      generatedCode += `
      .elementPresent(\`${selector}\`, \`${selectorType}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.EL_NOT_PRESENT_ASSERT) {
      generatedCode += `
      .elementNotPresent(\`${selector}\`, \`${selectorType}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.KEYDOWN) {
      generatedCode += `
      .sendKeys(\`${selector}\`, \`${selectorType}\`, ${util.getNWKeyValueFromCode(action.keyValue)}, \`${description}\`)`;
    }

    if (action.type === Actions.TEXT_ASSERT) {

      if (action.regex) {
        generatedCode += `
          .elTextIs(\`${selector}\`, \`${selectorType}\`, new RegExp(\`${action.value}\`, "g"), \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
      } else {
        generatedCode += `
          .elTextIs(\`${selector}\`, \`${selectorType}\`, \`${action.value}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
      }

    }

    if (action.type === Actions.TEXT_REGEX_ASSERT) {
      generatedCode += `
        .elTextIs(\`${selector}\`, \`${selectorType}\`, new RegExp(\`${action.value}\`, "g"), \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.STYLE_ASSERT) {
      generatedCode += `
        .elStyleIs(\`${selector}\`, \`${selectorType}\`, \`${action.style}\`, \`${action.value}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.VALUE_ASSERT) {
      if (action.regex) {
        generatedCode += `
        .inputValueAssert(\`${selector}\`, \`${selectorType}\`, new RegExp(\`${action.value}\`, "g"), \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
      } else {
        generatedCode += `
        .inputValueAssert(\`${selector}\`, \`${selectorType}\`, \`${action.value}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
      }

    }

    if (action.type === Actions.INPUT) {
      generatedCode += `
      .changeInput(\`${selector}\`, \`${selectorType}\`, \`${action.value}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

  });

  return generatedCode;

}
