var Actions = require('../../_shared/ActionConsts');
var util = require('../../_shared/util');
var _ = require('lodash');
var varname = require('varname');

function generateActionList(actions, components) {

  var generatedCode = "";

  actions.forEach((action, idx) => {

    var selector = action.selector;
    var description = action.description || util.buildActionDescription(action);

    if (action.type === Actions.COMPONENT) {

      var component = _.find(components, {id: action.componentId});
      if (!component) return;

      var actionListCode = generateActionList(component.actions, components);

      component.variables.forEach((variable) => {
        actionListCode = actionListCode.replace("${" + variable.name + "}", variable.defaultValue)
      });

      generatedCode += `${actionListCode}`;
    }

    if (action.type === Actions.POPSTATE || action.type === Actions.BACK) {
      // generatedCode += `
      // .snapBack()`;
    }

    if (action.type === Actions.FORWARD) {
      // generatedCode += `
      // // .forward(\`${description}\`) TODO: Forward not yet implementable in Chromeless. `;
    }

    if (action.type === Actions.REFRESH) {
      // generatedCode += `
      // .snapRefresh()`;
    }

    if (action.type === Actions.SCREENSHOT) {
      generatedCode += `
      .screenshot(\`screenshots/${action.value}\`)`;
    }

    if (action.type === Actions.MOUSEOVER) {
      // generatedCode += `
      // // .mouseover("${action.selector}", 1, 1, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.FOCUS) {
      generatedCode += `
      .wait("${action.selector}")
      .focus("${action.selector}")`;
    }

    if (action.type === Actions.BLUR) {
      // generatedCode += `
      // .wait("${action.selector}")
      // .snapBlur("${action.selector}")`;
    }

    if (action.type === Actions.SUBMIT) {
      // generatedCode += `
      // .snapSubmit("${action.selector}")`;
    }

    if (action.type === Actions.EXECUTE_SCRIPT) {
      // generatedCode += `
      // .evaluate(() => { \`${action.script}\`})`;
    }

    if (action.type === Actions.SCROLL_WINDOW) {
      // generatedCode += `
      // .scrollTo(${action.x}, ${action.y})`;
    }

    if (action.type === Actions.SCROLL_ELEMENT) {
      // generatedCode += `
      // // .scrollToElement("${action.selector}", ${action.x}, ${action.y}, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.SCROLL_WINDOW_ELEMENT) {
      // generatedCode += `
      // // .scrollWindowToElement("${action.selector}", \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.PAGELOAD && (idx === 0 || Actions.PAGELOAD && idx === 1)) {
      generatedCode += `
      .goto("${action.value}")
      // .viewport(${action.width}, ${action.height})`;
    }
    else if (action.type === Actions.PAGELOAD) {
      generatedCode += `
      // .pathIs("${action.value}", \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.FULL_PAGELOAD && (idx === 0 || Actions.PAGELOAD && idx === 1)) {
      generatedCode += `
      .goto("${action.value}")`;
    }
    else if (action.type === Actions.FULL_PAGELOAD) {
      generatedCode += `
      .goto("${action.value}")`;
    }

    if (action.type === Actions.CHANGE_WINDOW || action.type === Actions.CHANGE_WINDOW_AUTO) {
      // generatedCode += `
      // // .switchToWindow(${action.value}, \`${description}\`) TODO: Forward not yet implementable in Chromeless.`;
    }

    if (action.type === Actions.MOUSEDOWN) {
      generatedCode += `
      .click("${selector}")`;
    }

    if (action.type === Actions.PAUSE) {
      generatedCode += `
      .wait(${action.value})`;
    }

    if (action.type === Actions.EL_PRESENT_ASSERT) {
      generatedCode += `
      .wait("${selector}")`;
    }

    if (action.type === Actions.EL_NOT_PRESENT_ASSERT) {
      // generatedCode += `
      // // .elementNotPresent("${selector}", \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.KEYDOWN) {
      // generatedCode += `
      // .press(${util.getNWKeyValueFromCode(action.keyValue)})`;
    }

    if (action.type === Actions.TEXT_ASSERT) {
      // generatedCode += `
      // .snapTextIs("${selector}", \`${action.value}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.TEXT_REGEX_ASSERT) {
      // generatedCode += `
      // // .elTextRegex("${selector}", \`${action.value}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.VALUE_ASSERT) {
      // generatedCode += `
      // // .inputValueAssert("${selector}", \`${action.value}\`, \`${description}\`${action.timeout ? ", " + action.timeout : ""})`;
    }

    if (action.type === Actions.INPUT) {
      generatedCode += `
      .type(\`${action.value}\`, \`${selector}\`)`
    };

  });

  return generatedCode;

};

module.exports.generateActionList = generateActionList;