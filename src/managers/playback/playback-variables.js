import {getExtendedVariables} from '../../util/EnvUtils';

export const getSystemVarLabels = () => {

  var variables = [
    {
      key: "random",
      value: "Random String (e.g. \"9829980\")"
    },
    {
      key: "random1",
      value: "Random String slot 1 (e.g. \"9829980\")"
    },
    {
      key: "random2",
      value: "Random String slot 2 (e.g. \"9829980\")"
    },
    {
      key: "random3",
      value: "Random String slot 3 (e.g. \"9829980\")"
    }
  ];

  return variables;

};

export const getSystemVars = (globalVariables) => {

  var system = [{key: "random", value: parseInt(Math.random() * 10000000)}];

  for (var i in globalVariables) {
    system.push({key: i, value: globalVariables[i]});
  }

  return system;

};

export const getEnvVars = (dataProfiles, selectedProfileId, options) => {

  var selectedProfile, envVariables = [];

  if (options.envId) selectedProfile = _.find(dataProfiles, {profileId: options.envId});
  else selectedProfile = _.find(dataProfiles, {profileId: selectedProfileId});

  if (selectedProfile) {
    var profileVariablesArray = getExtendedVariables(selectedProfile, dataProfiles);
    envVariables = profileVariablesArray.map((variable) => ({key: variable.name, value: variable.defaultValue}));
  }

  return envVariables;

};

export const combineVarsWith = (_combinee, combiner, allowDups = true) => {

  var combinee = _combinee.slice(0);

  combiner.forEach((replacer) => {
    combinee.forEach((variable) => {

      if (allowDups) {
        var myRegEx = new RegExp(`\\$\\{${replacer.key}\\}`, "g");
        variable.value = variable.value.replace(myRegEx, replacer.value);
      } else if (replacer.key !== variable.key) {
        var myRegEx = new RegExp(`\\$\\{${replacer.key}\\}`, "g");
        variable.value = variable.value.replace(myRegEx, replacer.value);
      }

    });
  });

  return combinee;

};

export const spreadVariables = (variables) => {
  var variableObject = {};

  variables.forEach((variable) => {
    variableObject[variable.key] = variable.value;
  })

  return variableObject;

};
