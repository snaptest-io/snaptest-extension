import React from 'react'
import {getExtendedVariables} from '../../../util/EnvUtils'
import {safeIterateOverActions} from '../../../util/TestUtils'
import {getSystemVarLabels, combineVarsWith} from "../../../managers/playback/playback-variables";

class VariableTooltip extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    if (!this.props.varTooltipOpen) return <div></div>;

    const { varTooltipX, varTooltipY, varTooltipTarget } = this.props;

    const componentContext = this.getCompContextDetails();
    const envVars = this.getEnvironmentVars();
    const testVars = this.getTestVars();

    const system= this.getSystem();
    const testDefault= this.getTestDefault(testVars);
    const compDefault= this.getCompDefault(componentContext);
    const environment= this.getEnvironment(envVars);
    const compInstance= this.getCompInstance(componentContext, envVars, testVars);

    const computedIsSystem = (system && (!testDefault && !compDefault && !environment && !compInstance));
    const computedValue = compInstance || environment || compDefault || testDefault || system || null;

    return (
      <div className={"VariableTooltip"} style={{"top" : varTooltipY + "px", "left": varTooltipX + "px"}}>
        <div className="grid-row grid-column bottom-row">
          <div className="desc">Variable Application Flow:</div>
          <div className="grid-row v-align-start">
            <div className="inner-desc inner-desc-left">Source</div>
            <div className="inner-desc inner-desc-right">Values</div>
          </div>
          <div className="grid-row v-align-start">
            <div className="type">System</div>
            <div className={"value" + (system ? " applied" : "")}>{system || "none"}</div>
          </div>
          <div className="grid-row v-align-start">
            <div className="type">Test defaults</div>
            <div className={"value" + (testDefault ? " applied" : "")}>{testDefault ? this.wrapInQuotes(testDefault) : "none"}</div>
          </div>
          <div className="grid-row v-align-start">
            <div className="type">Comp defaults</div>
            <div className={"value" + (compDefault ? " applied" : "")}>{compDefault ? this.wrapInQuotes(compDefault) : "none"}</div>
          </div>
          <div className="grid-row v-align-start">
            <div className="type">Environment</div>
            <div className={"value" + (environment ? " applied" : "")}>{environment ? this.wrapInQuotes(environment) : "none"}</div>
          </div>
          <div className="grid-row v-align-start">
            <div className="type">Comp instance</div>
            <div className={"value" + (compInstance ? " applied" : "")}>{compInstance ? this.wrapInQuotes(compInstance) : "none"}</div>
          </div>
        </div>
        <div className="grid-row grid-column top-row">
          {/*<div className="desc">Computed Value:</div>*/}
          <div className="grid-row v-align computed">
            <div className="target">{varTooltipTarget}</div>
            {computedValue ? (
              <div className="derived-value">= {computedIsSystem ? computedValue : this.wrapInQuotes(computedValue)}</div>
            ) : (
              <div className="derived-value">= Value not found.</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  wrapInQuotes(value) {
    return `"${value}"`;
  }

  getCompContextDetails() {

    const { activeTest, varTooltipCompContext, tests, components } = this.props;
    var result = {compAction: null, component: null};

    if (!varTooltipCompContext) return result;

    var compAction;

    safeIterateOverActions(activeTest, tests, components, (action) => {
      if (action.id === varTooltipCompContext) compAction = action;
    });

    if (!compAction || compAction.type !== "COMPONENT") return result;

    var component = _.find(components, {id: compAction.componentId});

    if (!component) return result;

    return {
      compAction,
      component
    };
  }

  getSystem() {

    const { varTooltipTarget } = this.props;
    var computedValue = null;

    var systemVars = getSystemVarLabels();

    systemVars.forEach((sysVariable) => {
      if (sysVariable.key === varTooltipTarget) {
        computedValue = sysVariable.value;
      }
    });

    return computedValue;

  }

  getTestDefault(testVars) {

    const { activeTest, varTooltipTarget } = this.props;
    var computedValue = null;

    // case of viewing a component directly.
    if (activeTest.type === "component") {
      return computedValue; // should return null
    } else {

      testVars = combineVarsWith(testVars, getSystemVarLabels());
      testVars = combineVarsWith(testVars, testVars, false);

      testVars.forEach((testDefaultVar) => {
        if (testDefaultVar.key === varTooltipTarget) {
          computedValue = testDefaultVar.value;
        }
      });

      return computedValue;

    }
  }

  getCompDefault(componentContext) {

    const { activeTest, varTooltipTarget } = this.props;

    var computedValue = null;


    // case of viewing a component directly.
    if (activeTest.type === "component") {

      activeTest.variables.forEach((testDefaultVar) => {
        if (testDefaultVar.name === varTooltipTarget) {
          computedValue = testDefaultVar.defaultValue;
        }
      });

      return computedValue;

    }
    // case of viewing a variable within a nested component.
    else {

      if (!componentContext.component) return null;

      componentContext.component.variables.forEach((testDefaultVar) => {
        if (testDefaultVar.name === varTooltipTarget) {
          computedValue = testDefaultVar.defaultValue;
        }
      });

      return computedValue;

    }

  }

  getTestVars() {
    const { activeTest } = this.props;

    if (activeTest.type === "test") {
      return activeTest.variables.map((testVar) => ({key: testVar.name, value: testVar.defaultValue}));
    } else {
      return [];
    }

  }

  getEnvironmentVars() {

    const { selectedProfile, dataProfiles, varTooltipTarget } = this.props;

    if (selectedProfile) {

      var environment = _.find(dataProfiles, {id: selectedProfile});
      if (!environment) return [];

      return getExtendedVariables(environment, dataProfiles).map((envVar) => ({key: envVar.name, value: envVar.defaultValue}));

    }

    return [];
  }

  getEnvironment(envVars) {

    const { varTooltipTarget } = this.props;

    var computedValue = null;

    if (envVars && envVars.length > 0) {

      envVars = combineVarsWith(envVars, getSystemVarLabels());
      envVars = combineVarsWith(envVars, envVars, false);

      envVars.forEach((envVariable) => {
        if (envVariable.key === varTooltipTarget) {
          computedValue = envVariable.value;
        }
      });

    }

    return computedValue;

  }

  getCompInstance(componentContext, envVars, testVars) {

    const { varTooltipTarget } = this.props;

    if (!componentContext.compAction) return null;

    var computedValue = null;

    // compAction variables don't have the values applied, so we need to join on the component.variables.
    var compInstanceVars = componentContext.compAction.variables
      .map((actionIdVar) => {

        var compVariable = _.find(componentContext.component.variables, {id: actionIdVar.id});

        if (compVariable) return {...compVariable, ...actionIdVar};
        else return null; // case of comp var being deleted, but still in an action id:
      })
      .filter((compInstanceVar) => !!compInstanceVar)
      .map((compInstanceVar) => ({key: compInstanceVar.name, value: compInstanceVar.value }));

    compInstanceVars = combineVarsWith(compInstanceVars, testVars);
    compInstanceVars = combineVarsWith(compInstanceVars, envVars);

    compInstanceVars.forEach((instanceVar) => {
      if (instanceVar && instanceVar.key === varTooltipTarget && instanceVar.value !== "${default}") {
        computedValue = instanceVar.value;
      }
    });

    return computedValue;

  }

}

export default VariableTooltip;
