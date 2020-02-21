import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message'
import ActionDropMonitor from './ActionDropMonitor'
import * as Actions from '../../../models/Action'
import classNames from 'classnames'
import { DragSource } from 'react-dnd';
import ActionItem from './ActionItem'

const DEFAULT_TIMEOUT = 5000;

class ActionItemLine extends React.PureComponent {

  constructor(props) {
    super(props);

  }

  render() {

    const { connectDragSource, action, directory, drafts, activeTest, idx, onNWRowClick, isLast, isCursorHere, isRecording, isAssertMode, components, tests, disAllowComponents = false, isInComponent, isInComponentAction, actionSelectorId, selectionCandidate, playbackResult = null, playbackCursor, playbackBreakpoints = [], expandedActions = [], commentedActions = [], actionSelectorActionId, isPlayingBack, isEditable = true, showQuickActions = true, instigatorId = null, userSettings = {}, selectingForActionId} = this.props;

    var isIndicator = this.isIndicator();
    var isComponent = this.isComponent();
    var isConditional = this.isConditional();
    var hasBreakpoint = this.getHasBreakpoint();
    var component = this.getComponent();

    var actionProps = {
      action,
      idx,
      components,
      component,
      drafts,
      isInComponent,
      isInComponentAction,
      disAllowComponents,
      activeTest,
      actionSelectorId,
      selectionCandidate: selectionCandidate,
      playbackResult,
      playbackCursor,
      playbackBreakpoints,
      defaultTimeout: DEFAULT_TIMEOUT,
      isExpanded: expandedActions.indexOf(action.id) !== -1,
      showComment: commentedActions.indexOf(action.id) !== -1,
      actionSelectorActionId,
      isPlayingBack,
      userSettings,
      selectingForActionId,
      tree: directory ? directory.tree : null
    };

    var resultClasses = this.getPlaybackResultClasses();

    var wrapperClassnames = classNames({
      "nw-action-row-wrapper": true,
      "nw-indicator" : isIndicator,
      "nw-component": isComponent,
      "nw-conditional": isConditional,
      "commented": action.commented,
      "inherited": !!component && component.inherited,
      "not-editable": !isEditable,
      "expanded": actionProps.isExpanded,
      "show-comment": actionProps.showComment,
      "playback-processing": resultClasses.processing,
      "playback-success": resultClasses.successful,
      "playback-error": resultClasses.error && !resultClasses.skipped,
      "playback-skipped": resultClasses.skipped,
      "has-warning": userSettings.warnings && action.warnings.length > 0
    });

    return (
        <div className={wrapperClassnames} data-id={instigatorId ? instigatorId + "COMPONENT" + action.id : action.id}>
          <div className="debug-action"
               onClick={() => Message.promise("toggleActiveTestBreakpoint", { actionId: instigatorId ? instigatorId + "COMPONENT" + action.id : action.id})}>
            {this.showPlaybackCursor() && (
              <div className="playback-cursor"></div>
            )}
            <div className={"breakpoint-cursor" + (hasBreakpoint ? " active" : "")}></div>
          </div>
          {action.indent > 0 && this.getIndents()}
          <div className="grid-item grid-row grid-column">
            <div className="grid-row">
              <div className={"nw-action-row grid-row grid-item"}
                   key={idx}
                   onMouseOver={() => this.onActionItemMouseEnter(action)}
                   onMouseOut={() => this.onActionItemMouseOut(action)} >
                {connectDragSource(
                  <div className="grid-row action-selector" onClick={(e) => { e.stopPropagation(e); onNWRowClick(action, idx)}}>
                    <div className="drag-icon-cont">
                      <svg className="drag-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 6C6.67 6 6 6.67 6 7.5S6.67 9 7.5 9 9 8.33 9 7.5 8.33 6 7.5 6zm0 5c-.83 0-1.5.67-1.5 1.5S6.67 14 7.5 14 9 13.33 9 12.5 8.33 11 7.5 11zm0 5c-.83 0-1.5.67-1.5 1.5S6.67 19 7.5 19 9 18.33 9 17.5 8.33 16 7.5 16zm5-12c.83 0 1.5-.67 1.5-1.5S13.33 1 12.5 1 11 1.67 11 2.5 11.67 4 12.5 4zm-5-3C6.67 1 6 1.67 6 2.5S6.67 4 7.5 4 9 3.33 9 2.5 8.33 1 7.5 1zm5 10c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-10c-.83 0-1.5.67-1.5 1.5S11.67 9 12.5 9 14 8.33 14 7.5 13.33 6 12.5 6z"/></svg>
                    </div>
                    <div className={"checkbox" + (this.isRowSelected(action) ? " active" : "")} >
                      <div className="box"></div>
                    </div>
                  </div>
                )}
                {userSettings.actionNumbers && (
                  <div className="action-index">#{idx}</div>
                )}
                <ActionItem {...actionProps} />
              </div>
            </div>
            {resultClasses.error && (
              <div className={"playback-error-status grid-row v-align" + (resultClasses.skipped ? " error-warning" : "")}>
                <div className="grid-item">
                  {resultClasses.message}
                </div>
                {(!resultClasses.skipped && !isInComponent && (!action.indent || action.indent === 0)) && (
                  <button className="btn btn-primary" onClick={() => this.onContinueAfterFailure()}>Fixed!</button>
                )}
              </div>
            )}
            {!isLast && (
              <ActionDropMonitor className="grid-row quick-row-actions" actionId={action.id}>
                {isRecording ? (
                  <div className="cursor cursor-record grid-item" onClick={() => this.onSetRecordCursor(idx) } ><div className="dots">&#8226;&#8226;&#8226;</div></div>
                ) : isAssertMode ? (
                  <div className="cursor cursor-assert grid-item" onClick={() => this.onSetAssertCursor(idx) } ><div className="dots">&#8226;&#8226;&#8226;</div></div>
                ) : (
                  <div className="add-row" onClick={() => this.onAddBlank(idx)}>+</div>
                )}
              </ActionDropMonitor>
            )}
            {isCursorHere && (
              <div className={"record-cursor-container" + (isAssertMode ? " is-asserting" : "")}>
                <div className="record-cursor">
                  <div className="record-cursor-bar"></div>
                </div>
              </div>
            )}
          </div>
          {(isLast && !isIndicator) && (
            <div className="arrow-down"></div>
          )}
        </div>

    )
  }

  getIndents() {

    const { nextAction, action } = this.props;

    var indents = [];

    for (var i = 1; i <= action.indent; i++) {

      var lastInBlock = false;

      if (!nextAction || (nextAction.indent || 0) < i) lastInBlock = true;

      indents.push(
        <div key={i} className={"indent indent-" + action.indent + (lastInBlock ? " last-indent" : "")}>
          {lastInBlock && (
            <div className="arrow-down-2"></div>
          )}
        </div>
      )
    }

    return indents;

  }

  getComponent() {
    const { components, action, drafts } = this.props;

    var component = _.find(components, {id: action.componentId});
    if (!component) component = _.find(drafts, {id: action.componentId});
    return component;
  }

  getHasBreakpoint() {

    const { playbackBreakpoints = [], instigatorId, action } = this.props;

    if (playbackBreakpoints.length === 0) return false;
    if (!instigatorId) return playbackBreakpoints.indexOf(action.id) !== -1;

    for (var i = 0; i < playbackBreakpoints.length; i++) {
      var bp = playbackBreakpoints[i];
      if (bp.indexOf("COMPONENT") !== -1) {
        var bpTokens = bp.split("COMPONENT");
        if (bpTokens[0] === instigatorId && bpTokens[1] === action.id) return true;
      }

    }

    return false;

  }

  getPlaybackResultClasses() {

    const { instigatorId, action, playbackResult } = this.props;
    var result;

    if (instigatorId) {
      result = playbackResult[instigatorId + "COMPONENT" + action.id];
    } else {
      result = playbackResult[action.id];
    }

    if (!result || result.isComponent) return {
      processing: false,
      successful: false,
      error: false,
      skipped: false,
      message: null
    };

    return {
      processing: result.processing,
      successful: !result.processing && result.success,
      error: !result.processing && !result.success,
      skipped: !result.processing && result.skipped,
      message: result.message
    };
  }

  showPlaybackCursor() {

    const { action, playbackCursor, instigatorId } = this.props;

    if (!playbackCursor) return false;
    else if (!instigatorId) return playbackCursor === action.id;
    else {
      var tokens = playbackCursor.split("COMPONENT");
      return action.id === tokens[1] && instigatorId === tokens[0];
    }

  }

  isIndicator() {
    const { action } = this.props;
    return action.type === Actions.PUSHSTATE || action.type === Actions.URL_CHANGE_INDICATOR;
  }

  isComponent() {
    return this.props.action.type === Actions.COMPONENT || this.props.action.type === Actions.REQUEST;
  }

  isConditional() {
    const { action } = this.props;
    return action.type === Actions.IF ||
      action.type === Actions.ELSEIF ||
      action.type === Actions.ELSE ||
      action.type === Actions.TRY ||
      action.type === Actions.CATCH ||
      action.type === Actions.WHILE ||
      action.type === Actions.DOWHILE ||
      action.type === Actions.BREAK ||
      action.type === Actions.FOREACH;
  }

  onSetAssertCursor(idx) {
    const { isAssertMode } = this.props;
    Message.to(Message.SESSION, "setCursor", idx);
    if (!isAssertMode) Message.to(Message.SESSION, "setAssertMode", true)
  }

  onSetRecordCursor(idx) {
    const { isRecording } = this.props;
    Message.to(Message.SESSION, "setCursor", idx);
    if (!isRecording) Message.to(Message.SESSION, "startRecording", { initialUrl: window.location.href, width: window.innerWidth, height: window.innerHeight })
  }

  onAddBlank(idx) {
    Message.to(Message.SESSION, "insertNWAction", { insertAt: idx + 1, action: new Actions.BlankAction()});
  }

  onContinueAfterFailure() {

    const { primaryTabId, currentTabId } = this.props;

    if (currentTabId !== primaryTabId) {
      Message.to(Message.SESSION, "setActiveTabAlert", true);
    } else {
      Message.promise("resumeActiveTestPlayback");
    }

  }

  onActionItemMouseEnter() {

    const { action } = this.props;

    if (action.type !== Actions.STYLE_ASSERT) {
      if (_.isObject(action.value)) {
        Message.to(Message.SESSION, "setHoverIndicator", action.value);
      } else {
        Message.to(Message.SESSION, "setHoverIndicator", action);
      }
    }

  }

  onActionItemMouseOut() {
    Message.to(Message.SESSION, "setHoverIndicator", null);
  }

  isRowSelected() {
    if (!this.props.selectedRows) return false;
    return this.props.selectedRows.indexOf(this.props.action.id) !== -1;
  }

}

const testSource = {
  beginDrag(props) {
    return {
      sourceActionId: props.action.id
    };
  },
  endDrag
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function endDrag(props, monitor) {

  const dropResult = monitor.getDropResult();

  if (dropResult) Message.to(Message.SESSION, "moveAction", {sourceId: props.action.id, targetId: dropResult.actionId});


}


export default DragSource("ACTION", testSource, collect)(ActionItemLine);



