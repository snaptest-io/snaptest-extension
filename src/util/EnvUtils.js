import _ from 'lodash'

export function getExtendedVariables(selectedEnv, envs) {

  var gatheredVars = {};
  const ALLOWED_DEPTH = 5;  // in case of accidentally nested...

  function searchList(variables, currentDepth) {
    if (currentDepth === ALLOWED_DEPTH) return;
    variables.forEach((variable) => {
      if (variable.type === "ENV_VAR") {
        var matchingEnv = _.find(envs, {id: variable.defaultValue});
        if (matchingEnv) {
          searchList(matchingEnv.variables, currentDepth + 1);
        }
      } else {
        gatheredVars[variable.name] = variable.defaultValue;
      }
    })
  }

  searchList(selectedEnv.variables, 0);

  var varArray = [];

  for (var i in gatheredVars) {
    varArray.push({name: i, defaultValue: gatheredVars[i]})
  }

  return varArray;

}