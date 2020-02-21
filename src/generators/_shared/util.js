var _ = require('lodash');
var URL = require('url-parse');
var Actions = require('./ActionTruth');

module.exports.getDefaultLaunchUrlInfo = function (actions) {

  var launchUrl;
  var path;

  actions.forEach((action, idx) => {
    if (idx === 0 || idx == 1) {
      if (action.type === "FULL_PAGELOAD" || action.type === "PAGELOAD") {
        var url = new URL(action.value);
        launchUrl = url.origin;
        path = action.value.replace(url.origin, "");
      }
    }
  });

  return {
    launchUrl,
    path
  };
};

module.exports.getValueParamsForComponent = function (action, component) {

  var params = [];

  component.variables.forEach((variable) => {

    var variableInAction = _.find(action.variables, {id: variable.id});

    if (variableInAction) {
      params.push("\"" + variableInAction.value + "\"");
    } else {
      params.push("\"" + variable.defaultValue + "\"");
    }

  });

  return params;

};

module.exports.getKeyParamsForComponent = function(component) {

  var params = [];

  component.variables.forEach((variable) => {
    params.push(variable.name);
  });

  return params;

}

module.exports.buildParamStringFromArray = function (params) {
  var paramString = "";

  params.forEach((param, idx) => {
    if (idx !== params.length - 1) {
      paramString += param + ", "
    } else {
      paramString += param;
    }
  });

  return paramString;

};

module.exports.getNWKeyValueFromCode = function (keyCode) {
  switch(keyCode) {
    case "Enter":
      return "browser.Keys.ENTER";
    case "Escape":
      return "browser.Keys.ESCAPE";
    default:
      return "unknown";
  }
};

module.exports.buildActionDescription = function(action) {
  if (Actions.ActionsByConstant[action.type]) return Actions.ActionsByConstant[action.type].name;
  else return "";
};