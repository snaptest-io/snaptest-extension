import React from 'react'
import _ from 'lodash'
import * as ActionDefs from '../../../generators/_shared/ActionTruth'
import * as Actions from '../../../models/Action'
import Message from '../../../util/Message'
import ActionSelectorDD from "./ActionSelectorDD";
import deepClone from 'deep-clone'

class ActionSelector extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, actionSelectorId = null, components, tests, tree } = this.props;
    const actionName = this.props.actionName || this.getActionName();

    if (this.props.isInComponentAction) {
      return (
        <div className="ActionSelector disabled grid-row v-align">
          <div className="selected-action">
            {actionName}
          </div>
        </div>
      )
    }

    return (
      <div className="ActionSelector grid-row v-align">
        {actionSelectorId === action.id ? ([
          <div className="selected-action as-toggle active">{actionName}</div>,
          <ActionSelectorDD action={action}
                            components={components}
                            tests={tests}
                            tree={tree}
                            onActionSelected={(newActionType, componentId) => this.onActionTypeChange(action, newActionType, componentId)} />
        ]) : (
          <div className="selected-action" onClick={(e) => this.onClick(e)} >
            {actionName}
          </div>
        )}
      </div>
    )
  }

  onClick(e) {
    const { action } = this.props;
    e.stopPropagation();
    Message.to(Message.SESSION, "setActionSelectorId", action.id)
  }

  getActionName() {
    const { action, components } = this.props;
    if (action.type === "COMPONENT") {
      var component = _.find(components, {id: action.componentId});
      if (component) return component.name;
      else return "none";
    } else {
      if (ActionDefs.ActionsByConstant[action.type]) return ActionDefs.ActionsByConstant[action.type].name;
      else "none";
    }
  }

  onActionTypeChange(action, newActionType, componentId) {

    const { parentAction } = this.props;

    Message.to(Message.SESSION, "setActionSelectorId", null);

    var newAction;

    switch (newActionType) {
      case Actions.MOUSEDOWN:
        newAction = new Actions.MousedownAction();
        break;
      case Actions.DOUBLECLICK:
        newAction = new Actions.DoubleclickAction();
        break;
      case Actions.DIALOG:
        newAction = new Actions.DialogAction();
        break;
      case Actions.CLEAR_CACHES:
        newAction = new Actions.ClearCachesAction();
        break;
      case Actions.MOUSEOVER:
        newAction = new Actions.MouseoverAction();
        break;
      case Actions.FOCUS:
        newAction = new Actions.FocusAction();
        break;
      case Actions.BLUR:
        newAction = new Actions.BlurAction();
        break;
      case Actions.SUBMIT:
        newAction = new Actions.SubmitAction();
        break;
      case Actions.TEXT_ASSERT:
        newAction = new Actions.TextAssertAction();
        break;
      case Actions.TEXT_REGEX_ASSERT:
        newAction = new Actions.TextRegexAssertAction();
        break;
      case Actions.EL_PRESENT_ASSERT:
        newAction = new Actions.ElPresentAssertAction();
        break;
      case Actions.EL_NOT_PRESENT_ASSERT:
        newAction = new Actions.ElNotPresentAssertAction();
        break;
      case Actions.EL_VISIBLE_ASSERT:
        newAction = new Actions.ElVisibleAssertAction();
        break;
      case Actions.EL_NOT_VISIBLE_ASSERT:
        newAction = new Actions.ElNotVisibleAssertAction();
        break;
      case Actions.VALUE_ASSERT:
        newAction = new Actions.ValueAssertAction();
        break;
      case Actions.SCROLL_WINDOW:
        newAction = new Actions.ScrollWindow();
        break;
      case Actions.SCROLL_WINDOW_ELEMENT:
        newAction = new Actions.ScrollWindowToElement();
        break;
      case Actions.SCROLL_ELEMENT:
        newAction = new Actions.ScrollElement();
        break;
      case Actions.EXECUTE_SCRIPT:
        newAction = new Actions.ExecuteScriptAction();
        break;
      case Actions.KEYDOWN:
        newAction = new Actions.KeydownAction();
        break;
      case Actions.INPUT:
        newAction = new Actions.InputAction();
        break;
      case Actions.BACK:
        newAction = new Actions.BackAction();
        break;
      case Actions.REFRESH:
        newAction = new Actions.RefreshAction();
        break;
      case Actions.FORWARD:
        newAction = new Actions.ForwardAction();
        break;
      case Actions.CHANGE_WINDOW:
        newAction = new Actions.ChangeWindowAction();
        break;
      case Actions.PAUSE:
        newAction = new Actions.PauseAction();
        break;
      case Actions.SCREENSHOT:
        newAction = new Actions.ScreenshotAction();
        break;
      case Actions.URL_CHANGE_INDICATOR:
        newAction = new Actions.UrlChangeIndicatorAction();
        break;
      case Actions.COMPONENT:
        newAction = new Actions.ComponentAction();
        newAction.componentId = componentId;
        break;
      case Actions.REQUEST:
        newAction = new Actions.RequestAction(componentId);
        break;
      case Actions.PAGELOAD:
        newAction = new Actions.PageloadAction();
        break;
      case Actions.PATH_ASSERT:
        newAction = new Actions.PathAssertAction();
        break;
      case Actions.EVAL_ASSERT:
        newAction = new Actions.EvalAssertAction();
        break;
      case Actions.FULL_PAGELOAD:
        newAction = new Actions.FullPageloadAction();
        break;
      case Actions.META_SCAN:
        newAction = new Actions.MetaScanAction();
        break;
      case Actions.CLEAR_COOKIES:
        newAction = new Actions.ClearCookiesAction();
        break;
      case Actions.STYLE_ASSERT:
        newAction = new Actions.StyleAssertAction();
        break;
      case Actions.DYNAMIC_VAR:
        newAction = new Actions.DynamicVarAction();
        break;
      case Actions.IF:
        newAction = new Actions.IfAction();
        if (_.isObject(action.value)) newAction.value = deepClone(action.value);
        break;
      case Actions.ELSEIF:
        newAction = new Actions.IfElseAction();
        if (_.isObject(action.value)) newAction.value = deepClone(action.value);
        break;
      case Actions.ELSE:
        newAction = new Actions.ElseAction();
        break;
      case Actions.TRY:
        newAction = new Actions.TryAction();
        break;
      case Actions.CATCH:
        newAction = new Actions.CatchAction();
        break;
      case Actions.WHILE:
        newAction = new Actions.WhileAction();
        if (_.isObject(action.value)) newAction.value = deepClone(action.value);
        break;
      case Actions.FOREACH:
        newAction = new Actions.ForeachAction();
        break;
      case Actions.EVAL:
        newAction = new Actions.EvalAction();
        break;
      case Actions.CSV_INSERT:
        newAction = new Actions.CsvInsertAction();
        break;
      case Actions.BREAK:
        newAction = new Actions.BreakAction();
        break;
      case Actions.DOWHILE:
        newAction = new Actions.DoWhileAction();
        if (_.isObject(action.value)) newAction.value = deepClone(action.value);
        break;
      case Actions.CHANGE_FRAME:
        newAction = new Actions.ChangeFrameAction();
        break;
      case Actions.EXIT_FRAME:
        newAction = new Actions.ExitFrameAction();
        break;
    }

    newAction.id = action.id;
    newAction.description = action.description;
    newAction.timeout = action.timeout;
    newAction.indent = action.indent;

    if (_.isString(newAction.value) && _.isString(action.value)) newAction.value = action.value;
    if (_.isBoolean(newAction.continueOnFail) && _.isBoolean(action.continueOnFail)) newAction.continueOnFail = action.continueOnFail;
    if (_.isString(newAction.selector) && _.isString(action.selector)) newAction.selector = action.selector;
    if (_.isString(newAction.selectorType) && _.isString(action.selectorType)) newAction.selectorType = action.selectorType;

    if (parentAction) {
      parentAction.value = newAction;
      Message.to(Message.SESSION, "updateNWAction", parentAction);
    } else {
      Message.to(Message.SESSION, "updateNWAction", newAction);
    }

  }

}

export default ActionSelector;
