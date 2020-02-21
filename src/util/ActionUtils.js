import * as ActionDefs from '../generators/_shared/ActionTruth'

export function getActionDefinition(type, value, selector, selectorType) {

  var actionDef = ActionDefs.ActionsByConstant[type];

  if (!actionDef) {
    return `${type} ${value ? value : ""}`;
  } else {
    return`${actionDef.name} "${value ? value : ""}" ${selector ? `using "${selector}" (${selectorType})` : ""}`
  }

}