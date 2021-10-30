import React from 'react'
import * as Actions from '../../../models/Action'
import {MouseClickActionItem,
  PageLoadActionItem,
  InputChangeActionItem,
  BlankActionItem,
  LinkChangeIndicator,
  BackActionItem,
  KeyDownActionItem,
  ValueAssertActionItem,
  ComponentActionItem,
  PauseActionItem,
  XYCoordActionItem,
  ScriptActionItem,
  ActionWithNumberValue,
  AutoChangeWindowAction,
  MetaScanActionItem,
  ValueAssert,
  StyleAssertActionItem,
  DialogActionItem,
  ClearCachesAction,
  DynamicVarActionItem,
  ConditionalAction,
  EvalAssertActionItem,
  TryCatchAction,
  ForeachActionItem,
  WhileAction,
  CSVInsertRowActionItem,
  RequestActionItem,
  AssertVisibleActionItem,
} from './ActionItems/'

class ActionItem extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    
    const { action } = this.props;

    return (
      action.type === Actions.FULL_PAGELOAD ? (<PageLoadActionItem {...this.props} />)
      : (
        action.type === Actions.PAGELOAD ||
        action.type === Actions.PATH_ASSERT ||
        action.type === Actions.CLEAR_COOKIES ) ? (<ValueAssert {...this.props} />)
      : ( action.type === Actions.CLEAR_CACHES ) ? (<ClearCachesAction {...this.props} />)
      : ( action.type === Actions.DIALOG ) ? (<DialogActionItem {...this.props} />)
      : ( action.type === Actions.STYLE_ASSERT ) ? (<StyleAssertActionItem {...this.props} />)
      : (
        action.type === Actions.MOUSEDOWN ||
        action.type === Actions.DOUBLECLICK ||
        action.type === Actions.EL_PRESENT_ASSERT ||
        action.type === Actions.EL_NOT_PRESENT_ASSERT ||
        action.type === Actions.MOUSEOVER ||
        action.type === Actions.FOCUS ||
        action.type === Actions.BLUR ||
        action.type === Actions.SCROLL_WINDOW_ELEMENT ||
        action.type === Actions.SUBMIT ||
        action.type === Actions.ENTER_FRAME) ? (<MouseClickActionItem {...this.props} />)
      : ( action.type === Actions.CHANGE_WINDOW_AUTO ) ? (<AutoChangeWindowAction {...this.props} />)
      : (
        action.type === Actions.EL_VISIBLE_ASSERT ||
        action.type === Actions.EL_NOT_VISIBLE_ASSERT) ? (<AssertVisibleActionItem {...this.props} />)
      : (
        action.type === Actions.POPSTATE ||
        action.type === Actions.BACK ||
        action.type === Actions.FORWARD ||
        action.type === Actions.SCREENSHOT ||
        action.type === Actions.EXIT_FRAME ||
        action.type === Actions.MOST_RECENT_TAB ||
        action.type === Actions.CLOSE_TAB ||
        action.type === Actions.REFRESH ) ? (<BackActionItem {...this.props} />)
      : ( action.type === Actions.CHANGE_WINDOW) ? (<ActionWithNumberValue {...this.props} />)
      : ( action.type === Actions.INPUT  ) ? (<InputChangeActionItem {...this.props} />)
      : ( action.type === Actions.DYNAMIC_VAR ) ? (<DynamicVarActionItem {...this.props} />)
      : (
        action.type === Actions.IF ||
        action.type === Actions.ELSEIF||
        action.type === Actions.ELSE ) ? (<ConditionalAction {...this.props} />)
      : (
        action.type === Actions.TRY ||
        action.type === Actions.CATCH ) ? (<TryCatchAction {...this.props} />)
      : (
        action.type === Actions.TEXT_ASSERT ||
        action.type === Actions.TEXT_REGEX_ASSERT ||
        action.type === Actions.VALUE_ASSERT ) ? (<ValueAssertActionItem {...this.props} />)
      : (
        action.type === Actions.SCROLL_ELEMENT ||
        action.type === Actions.SCROLL_WINDOW)  ? (<XYCoordActionItem {...this.props} />)
      : ( action.type === Actions.BLANK || action.type === Actions.BREAK ) ? (<BlankActionItem {...this.props} />)
      : ( action.type === Actions.FOREACH ) ? (<ForeachActionItem {...this.props} />)
      : ( action.type === Actions.CSV_INSERT ) ? (<CSVInsertRowActionItem {...this.props} />)
      : ( action.type === Actions.WHILE || action.type === Actions.DOWHILE) ? (<WhileAction {...this.props} />)
      : ( action.type === Actions.PUSHSTATE || action.type === Actions.URL_CHANGE_INDICATOR) ? (<LinkChangeIndicator {...this.props} />)
      : ( action.type === Actions.KEYDOWN ) ? (<KeyDownActionItem {...this.props} />)
      : ( action.type === Actions.EVAL_ASSERT || action.type === Actions.EVAL) ? (<EvalAssertActionItem {...this.props} />)
      : ( action.type === Actions.COMPONENT ) ? (<ComponentActionItem {...this.props} instigatorId={action.id}/>)
      : ( action.type === Actions.PAUSE ) ? (<PauseActionItem {...this.props} />)
      : ( action.type === Actions.EXECUTE_SCRIPT ) ? (<ScriptActionItem {...this.props} />)
      : ( action.type === Actions.META_SCAN ) ? (<MetaScanActionItem {...this.props} />)
      : ( action.type === Actions.REQUEST ) ? (<RequestActionItem {...this.props} />)
      : null
    )
  }

}

export default ActionItem;
