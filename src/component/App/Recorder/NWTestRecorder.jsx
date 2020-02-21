import React from 'react'
import _ from 'lodash'
import KeyHandler, {KEYPRESS} from 'react-key-handler';
import * as Actions from '../../../models/Action'
import Message from '../../../util/Message'
import ActionItemLine from './ActionItemLine'
import {Dropdown, SweetTextInput, Variable} from '../../'
import {StringVariable} from "../../../models/Variable";
import {SYSTEM_VARS} from '../../../models/Variable'
import ReactTooltip from 'simple-react-tooltip'
import ActionDropMonitor from './ActionDropMonitor'
import Mousetrap from 'mousetrap'
import ResultBubble from './ResultBubble'
import VariableTooltip from "./VariableTooltip";
import Route from "../../../models/Route";

class NWTestRecorder extends React.Component {

  constructor(props) {

    super(props);

    this.state = { isShiftSelected: false, showSysVars: false }

  }

  componentDidMount() {
    Mousetrap.bind("tab", (e) => {
      if (this.props.selectedRows.length > 0) {
        e.preventDefault();
        this.onIndentSelected();
      }
    });
    Mousetrap.bind("shift+tab", (e) => {
      if (this.props.selectedRows.length > 0) {
        e.preventDefault();
        this.onUnindentSelected();
      }
    });
    Mousetrap.bind("escape", (e) => {
      if (this.props.selectedRows.length > 0) {
        e.preventDefault();
        this.onClearSelected();
      }
    });
    Mousetrap.bind("command+/", (e) => {
      if (this.props.selectedRows.length > 0) {
        e.preventDefault();
        this.onComment();
      }
    });

    Mousetrap.bind("ctrl+/", (e) => {
      if (this.props.selectedRows.length > 0) {
        e.preventDefault();
        this.onComment();
      }
    });

  }

  render() {

    const {
      isRecording = false,
      isAssertMode = false,
      isPlayingBack = false,
      cursorIndex = -1,
      components = [],
      currentRoute,
      activeTest,
      selectedRows,
      showHotkeys,
      hotkeyConfig,
      selectingForActionId,
      selectionCandidate,
      playbackResult,
      playbackCursor,
      playbackError,
      playbackBreakpoints,
      expandedActions,
      commentedActions,
      liveoutput,
      playbackInterval,
      playbackLoopAmount,
      drafts,
      userSettings,
      actionSelectorId,
      directory,
      viewTestVars,
      viewTestDescription,
      activeResult,
      tags,
      tagIdtoNameMap
    } = this.props;

    if (!activeTest) return null;
    const testTags = activeTest ? (this.props.testsInTagsMap[activeTest.id] || []) : [];

    const { actions = [] } = activeTest;

    return (
      <div className={"NWTestRecorder" + (liveoutput ? " in-live-output" : "")} onClick={(e) => this.onClick(e)} ref="container">
        <VariableTooltip {...this.props} />
        <KeyHandler keyEventName={"keydown"} keyValue="Shift" onKeyHandle={() => this.onShiftDown( )} />
        <KeyHandler keyEventName={"keyup"} keyValue="Shift" onKeyHandle={() => this.onShiftUp() } />
        {viewTestDescription && (
          <SweetTextInput value={activeTest.description || ""}
                          onChange={(value) => Message.to(Message.SESSION, "setCurrentTestDescription", value)}
                          className="sweetinput-border test-top-description"
                          placeholder="No description..." />
        )}
        <div className="grid-row floating-buttons quick-button-dd">
          <button className="btn btn-with-icon" onClick={() => Message.to(Message.SESSION, "setViewTestVars", !viewTestVars)} >
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.93 3.79a9.1 9.1 0 0 1 2.2-2.27L7.29 1c-1.38.59-2.57 1.33-3.55 2.22C2.46 4.39 1.49 5.72.83 7.23.28 8.51 0 9.81 0 11.12c0 2.28.83 4.57 2.49 6.86l.16-.55c-.49-1.23-.73-2.38-.73-3.44 0-1.67.28-3.46.84-5.36.55-1.9 1.28-3.51 2.17-4.84zm9.38 8.39l-.33-.2c-.37.54-.65.87-.82 1a.74.74 0 0 1-.42.12c-.19 0-.38-.12-.57-.37-.31-.42-.73-1.59-1.26-3.5.47-.85.86-1.41 1.19-1.67.23-.19.48-.29.74-.29.1 0 .28.04.53.11.26.07.48.11.68.11.27 0 .5-.1.68-.29.18-.19.27-.44.27-.75 0-.33-.09-.58-.27-.77-.18-.19-.44-.29-.78-.29-.3 0-.59.07-.86.22s-.61.47-1.02.97c-.31.37-.77 1.02-1.37 1.94a9.683 9.683 0 0 0-1.24-3.14l-3.24.59-.06.36c.24-.05.44-.07.61-.07.32 0 .59.14.8.43.33.45.8 1.8 1.39 4.07-.47.64-.78 1.06-.96 1.26-.28.32-.52.53-.7.62-.14.08-.3.11-.48.11-.14 0-.36-.08-.67-.23-.21-.1-.4-.15-.57-.15-.31 0-.57.11-.78.32s-.31.48-.31.8c0 .31.09.55.28.75.19.19.44.29.76.29.31 0 .6-.07.87-.2s.61-.42 1.02-.86c.41-.44.98-1.13 1.7-2.08.28.9.52 1.56.72 1.97.2.41.44.71.7.89.26.18.59.27.99.27.38 0 .77-.14 1.17-.43.54-.36 1.07-1 1.61-1.91zM17.51 1l-.15.54c.49 1.24.73 2.39.73 3.45 0 1.43-.21 2.96-.63 4.6-.33 1.26-.75 2.45-1.27 3.55-.52 1.11-1.02 1.97-1.51 2.6-.49.62-1.09 1.2-1.8 1.72l-.17.53c1.38-.59 2.57-1.34 3.55-2.23 1.29-1.17 2.26-2.5 2.91-4 .55-1.28.83-2.59.83-3.91 0-2.27-.83-4.56-2.49-6.85z"/></svg>
            {viewTestVars ? "Hide" : ""} Variables
          </button>
          <button className="btn btn-with-icon" onClick={() => Message.to(Message.SESSION, "setViewTestDescription", !viewTestDescription)}>
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.41 13.41l7.65-7.65-2.83-2.83-7.65 7.65 2.83 2.83zm10-10c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2-.55 0-1.05.22-1.41.59l-1.65 1.65 2.83 2.83 1.64-1.66zM18 18H2V2h8.93l2-2H1C.45 0 0 .45 0 1v18c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7.07l-2 2V18zM4 16l4.41-1.59-2.81-2.79L4 16z"/></svg>
            {viewTestDescription ? "Hide" : ""} Description
          </button>
          <div className="grid-row v-align button-group">
            {activeTest.draft && (
              [
                <button key={0} className="btn btn-primary" onClick={() => this.onSaveDraft()}>Save</button>,
                <button key={1} className="btn btn-delete" onClick={() => this.onDiscardDraft()}>Discard</button>
              ]
            )}
          </div>
          {!activeTest.draftOf && (
            <Dropdown button={
              <button className="btn btn-with-icon">
                <svg viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
                Tags
              </button>
            }>
              <div onClick={(e) => e.stopPropagation()}>
                <div className="dd-header">Tag a Test</div>
                {tags.map((tag, idx) => (
                  <TestTagCheckbox className="dd-item"
                                   key={idx}
                                   tag={tag}
                                   testTags={testTags}
                                   testId={activeTest.id}
                                   tagIdtoNameMap={tagIdtoNameMap} />
                ))}
                {tags.length === 0 && (
                  <div className="dd-empty">
                    <div className="dd-empty-message">No tags created yet.</div>
                  </div>
                )}
              </div>
            </Dropdown>
          )}
        </div>

        {viewTestVars && (
          <div className="var-container">
            <div className="grid-row var-options">
              <button className="btn btn-with-icon" onClick={(e) => this.onAddVar(e)}>
                <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm5-9h-4V5c0-.55-.45-1-1-1s-1 .45-1 1v4H5c-.55 0-1 .45-1 1s.45 1 1 1h4v4c0 .55.45 1 1 1s1-.45 1-1v-4h4c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
                Add
              </button>
              <button className="btn btn-with-icon" onClick={(e) => this.setState({showSysVars: !this.state.showSysVars})}>
                <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 8h-1.26c-.19-.73-.48-1.42-.85-2.06l.94-.94a.996.996 0 0 0 0-1.41l-1.41-1.41a.996.996 0 0 0-1.41 0l-.94.94c-.65-.38-1.34-.67-2.07-.86V1c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1.26c-.76.2-1.47.5-2.13.89L5 2.28a.972.972 0 0 0-1.36 0L2.28 3.64c-.37.38-.37.98 0 1.36l.87.87c-.39.66-.69 1.37-.89 2.13H1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h1.26c.19.73.48 1.42.85 2.06l-.94.94a.996.996 0 0 0 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l.94-.94c.64.38 1.33.66 2.06.85V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-1.26c.76-.2 1.47-.5 2.13-.89l.88.87c.37.37.98.37 1.36 0l1.36-1.36c.37-.38.37-.98 0-1.36l-.87-.87c.4-.65.7-1.37.89-2.13H19c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-9 7c-2.76 0-5-2.24-5-5s2.24-5 5-5v10z"/></svg>
                {this.state.showSysVars ? "Hide" : ""} System
              </button>
            </div>
            {(activeTest.variables.length > 0 || this.state.showSysVars) && (
              <div className="variables">
                {activeTest.variables.map((variable, idx) => (
                  <Variable name={variable.name}
                            system={variable.system}
                            value={variable.defaultValue}
                            onNameChange={(newName) => this.onVarNameChange(variable, newName)}
                            onValueChange={(newValue) => this.onVarDefaultvalueChange(variable, newValue)}
                            onDelete={() => this.onVarDelete(variable)} />
                ))}
                {this.state.showSysVars && SYSTEM_VARS.map((variable, idx) => (
                  <Variable name={variable.name}
                            system={variable.system}
                            value={variable.defaultValue}
                            onNameChange={(newName) => this.onVarNameChange(variable, newName)}
                            onValueChange={(newValue) => this.onVarDefaultvalueChange(variable, newValue)}
                            onDelete={() => this.onVarDelete(variable)} />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="test-header">
          <div className="grid-row v-align-start test-header-controls">
            <div className="grid-row v-align selection-actions">
              <button className={"btn btn-primary play-btn grid-row v-align" + ((playbackCursor && isPlayingBack) ? " active" : "")}>
                <Dropdown classNames=""
                          onClick={(e) => e.stopPropagation()}
                          button={
                            <img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick-white.png")} />
                          }>
                  <div>
                    {(playbackInterval || playbackLoopAmount || selectedRows.length > 0) && ([
                      <div key={0} className="dd-item grid-row"
                           onClick={() => { Message.to(Message.SESSION, "clearSelectedRows"); Message.to(Message.SESSION, "setPlaybackInterval", null); Message.to(Message.SESSION, "setPlaybackLoopAmount", null)}}>
                        <div className="grid-item">Reset</div>
                      </div>,
                      <hr key={1} />
                    ])}
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackInterval", null)}>
                      <div className="grid-item">Play</div>
                      <div className="lower-case">(no delay)</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackInterval", 500)}>
                      <div className="grid-item">Play slow</div>
                      <div className="lower-case">(500 ms)</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackInterval", 1500)}>
                      <div className="grid-item">Play super slow</div>
                      <div className="lower-case">(1500 ms)</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setModal", "custom-delay")}>
                      <div className="grid-item">Set custom</div>
                    </div>
                    <hr />
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackLoopAmount", null)}>
                      <div className="grid-item">Play once</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackLoopAmount", 2)}>
                      <div className="grid-item">Play twice</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackLoopAmount", 3)}>
                      <div className="grid-item">Play three times</div>
                    </div>
                    <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setModal", "custom-repeat")}>
                      <div className="grid-item" >Set custom</div>
                    </div>
                  </div>
                </Dropdown>
                { isPlayingBack ? (
                  <div className="btn-label" onClick={() => this.onPausePlayback()}>
                    <span>Pause {selectedRows.length > 0 && (<span className="lower-case small">({selectedRows.length + " row" + (selectedRows.length > 1 ? "s" : "")})</span>)} {playbackInterval && (<span className="lower-case small">({playbackInterval + "ms delay"})</span>)} {playbackLoopAmount && (<span className="lower-case small">({playbackLoopAmount + "x"})</span>)}</span>
                  </div>
                ) : !isPlayingBack && !playbackCursor ? (
                  <div className="btn-label" onClick={() => this.onStartPlayback()}>
                    <span>Play {selectedRows.length > 0 && (<span className="lower-case small">({selectedRows.length + " row" + (selectedRows.length > 1 ? "s" : "")})</span>)} {playbackInterval && (<span className="lower-case small">({playbackInterval + "ms delay"})</span>)} {playbackLoopAmount && (<span className="lower-case small">({playbackLoopAmount + "x"})</span>)}</span>
                  </div>
                ) : (
                  <div className="btn-label" onClick={() => this.onResumePlayback()}>
                    <span>Resume {selectedRows.length > 0 && (<span className="lower-case small">({selectedRows.length + " row" + (selectedRows.length > 1 ? "s" : "")})</span>)} {playbackInterval && (<span className="lower-case small">({playbackInterval + "ms delay"})</span>)} {playbackLoopAmount && (<span className="lower-case small">({playbackLoopAmount + "x"})</span>)}</span>
                  </div>
                )}
              </button>
              {playbackError && (
                <div className="playback-error">{playbackError}</div>
              )}
              {(!_.isEmpty(playbackResult)) && (
                <button className={"btn bail-btns"} onClick={() => this.onResetPlayback() }>
                  {isPlayingBack ? "Bail" : "Reset"}
                </button>
              )}
              {(playbackCursor && !_.isEmpty(playbackResult)) && (
                <button className={"btn play-btns" + (isPlayingBack ? " btn-disabled" : "")} onClick={() => this.onStepOver() }>
                  Step Once
                </button>
              )}
            </div>
            <div className="grid-item grid-row h-align-right test-controls">
              <div className="grid-row h-align-right">
                {isAssertMode ? (
                  <button className={"btn assert-btn active"} onClick={() => Message.promise("stopAsserting")}>
                    Assert
                  </button>
                ) : (
                  <button className={"btn assert-btn"} onClick={() => Message.promise("startAsserting")}>
                    Assert
                  </button>
                )}
                { (isRecording && !isAssertMode) ? (
                  <button className={"btn recording-btn active"} onClick={() => Message.promise("stopRecording")}>
                    {showHotkeys && (<div className="hotkey">({hotkeyConfig.RECORD_MODE})</div>)}
                    Record
                  </button>
                ) : (
                  <button className={"btn recording-btn"} onClick={() =>Message.promise("startRecording") }>
                    {showHotkeys && (<div className="hotkey">({hotkeyConfig.RECORD_MODE})</div>)}
                    Record
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="grid-row v-align quick-buttons quick-button-dd selection-commands" onClick={(e) => e.stopPropagation()}>
            <div className="grid-item grid-row">
              <Dropdown button={
                <button className="debug-menu grid-row v-align">
                  <div className={"icon" + (playbackBreakpoints.length > 0 ? " active" : "")}></div>
                  {playbackBreakpoints.length > 0 && (
                    <div className="amount-count">({playbackBreakpoints.length})</div>
                  )}
                  <img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick.png")} />
                </button>}>
                <div>
                  <div className="dd-header">breakpoints</div>
                  <div className="dd-item" onClick={() => this.onClearAllBreakpoints() }>
                    Clear all
                  </div>
                  <div className="dd-item" onClick={() => this.onBreakpointWarnings() }>
                    Breakpoint warnings
                  </div>
                </div>
              </Dropdown>
              <button className={"btn btn-empty" + (actions.length > 0 ? "" : " btn-disabled")} onClick={(e) => { this.onSelectAll(e)}}>
                Select All
              </button>
              {selectedRows.length > 0 && ([
                <button className={"btn btn-empty" + (selectedRows.length > 0 ? "" : " btn-disabled")} onClick={() => this.onClearSelected()}>
                  Clear
                </button>,
                <button className={"btn btn-empty" + (selectedRows.length > 0 ? "" : " btn-disabled")} onClick={() => this.onComment()}>
                  Skip
                </button>,
                <button className={"btn btn-empty" + (selectedRows.length > 0 ? "" : " btn-disabled")} onClick={() => this.onUnindentSelected()}>
                  Un-indent
                </button>,
                <button className={"btn btn-empty" + (selectedRows.length > 0 ? "" : " btn-disabled")} onClick={() => this.onIndentSelected()}>
                  Indent
                </button>,
                <Dropdown button={<button className={"btn btn-empty"}>actions<img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick.png")} /></button>}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <div className="dd-header">actions</div>
                    <div className="dd-item" onClick={() => this.onRollup() }>
                      rollup into component
                    </div>
                    <div className="dd-item" onClick={() => this.onClearCacheOptimize() }>
                      auto clear cache
                    </div>
                    <div className="dd-item" onClick={() => this.onAddPathAssert() }>
                      auto path-asserts
                    </div>
                    <div className="dd-item" onClick={() => this.onAutoDescribe() }>
                      auto-describe
                    </div>
                    <hr />
                    <div className="dd-header">view</div>
                    <div className="dd-item" onClick={() => this.onSetViewType("actions") }>
                      show actions
                    </div>
                    <div className="dd-item" onClick={() => this.onSetViewType("descriptions") }>
                      show descriptions
                    </div>
                    <div className="dd-item" onClick={() => this.onExpandAll() }>
                      show details
                    </div>
                    <div className="dd-item" onClick={() => this.onShrinkAll() }>
                      hide details
                    </div>
                    <hr />
                    <div className="dd-header">delete</div>
                    <div className="dd-item dd-warn" onClick={() => this.onDeleteActions()}>
                      delete actions
                    </div>
                    <div className="dd-item dd-warn" onClick={() => this.onDismissWarnings() }>
                      dismiss warnings
                    </div>
                    <div className="dd-item dd-warn" onClick={() => this.removeDescriptions()}>
                      delete descriptions
                    </div>
                  </div>
                </Dropdown>,
                <button className={"btn btn-empty btn-warn" + (selectedRows.length > 0 ? "" : " btn-disabled")} onClick={() => this.onDeleteActions()}>
                  Delete
                </button>
              ])}
            </div>
            <div>
              <div onClick={() => this.onSetViewType("actions", true)} title="view actions" data-tip='View action details' className="undo-redo-icon">
                <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm8-3H6c-3.31 0-6 2.69-6 6s2.69 6 6 6h8c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 11H6c-2.76 0-5-2.24-5-5s2.24-5 5-5h8c2.76 0 5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" id="Ellipse_2_6_"/></svg>
              </div>
              <div onClick={() => this.onSetViewType("descriptions", true)} className="undo-redo-icon" title="view descriptions" data-tip='View descriptions'>
                <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3v4a1.003 1.003 0 0 0 1.71.71l4.7-4.71H19c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM4 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" id="comment_1_"/></svg>
              </div>
              {activeTest.type === "test" && ([
                <div onClick={() => Message.to(Message.SESSION, "undo")} className="undo-redo-icon" title="undo" key={0} data-tip='Undo'>
                  <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm9-9H3.41L5.7 2.71c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71l-4 4C.11 5.47 0 5.72 0 6c0 .28.11.53.29.71l4 4a1.003 1.003 0 0 0 1.42-1.42L3.41 7H14c2.21 0 4 1.79 4 4s-1.79 4-4 4H9v2h5c3.31 0 6-2.69 6-6s-2.69-6-6-6z" id="undo_1_"/></svg>
                </div>,
                <div onClick={() => Message.to(Message.SESSION, "redo")} className="undo-redo-icon" title="redo" key={1}  data-tip='Redo'>
                  <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.71 5.29l-4-4a1.003 1.003 0 0 0-1.42 1.42L16.59 5H6c-3.31 0-6 2.69-6 6s2.69 6 6 6h5v-2H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h10.59L14.3 9.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l4-4c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71zM15 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" id="redo_1_"/></svg>
                </div>
              ])}
            </div>
          </div>
        </div>
        <div className="action-list" ref="actionlist">
          <ActionDropMonitor className="grid-row quick-row-actions first-add-button" actionId={"start"}>
            {isRecording ? (
              <div className="cursor cursor-record grid-item" onClick={() => this.onSetRecordCursor(-1) } ><div className="dots">&#8226;&#8226;&#8226;</div></div>
            ): isAssertMode ? (
              <div className="cursor cursor-assert grid-item" onClick={() => this.onSetAssertCursor(-1) } ><div className="dots">&#8226;&#8226;&#8226;</div></div>
            ) : actions.length > 0 ? (
              <div className="add-row" onClick={() => this.onAddBlank(0)}>+</div>
            ) : null}
          </ActionDropMonitor>
          { ((isAssertMode || isRecording) && cursorIndex === -1) && (
            <div className={"record-cursor-container" + (isAssertMode ? " is-asserting" : "")}>
              <div className="record-cursor">
                <div className="record-cursor-bar"></div>
              </div>
            </div>
          )}
          <div className="nw-section" onClick={(e) => this.onOutsideClick()}>
            {actions.map((action, idx) => (
              <ActionItemLine action={action}
                              isInComponent={currentRoute.name === "componentbuilder"}
                              idx={idx}
                              nextAction={actions[idx + 1]}
                              components={components}
                              activeTest={activeTest}
                              onNWRowClick={(action, idx) => this.onNWRowClick(action, idx) }
                              selectedRows={selectedRows}
                              isLast={idx === actions.length - 1}
                              isFirst={idx === 0}
                              isCursorHere={cursorIndex === idx && (isRecording || isAssertMode)}
                              isAssertMode={isAssertMode}
                              isRecording={isRecording}
                              isPlayingBack={isPlayingBack}
                              selectingForActionId={selectingForActionId}
                              selectionCandidate={selectionCandidate}
                              playbackResult={playbackResult}
                              playbackCursor={playbackCursor}
                              playbackBreakpoints={playbackBreakpoints}
                              expandedActions={expandedActions}
                              commentedActions={commentedActions}
                              drafts={drafts}
                              actionSelectorId={actionSelectorId}
                              userSettings={userSettings}
                              directory={directory}
              />
            ))}
          <ActionDropMonitor className="grid-row quick-row-actions last-add-button" actionId={"end"}>
            {isRecording ? (
              <div className="cursor cursor-record grid-item" onClick={() => this.onSetRecordCursor(null) } ><div className="dots">&#8226;&#8226;&#8226;</div></div>
            ) : isAssertMode ? (
              <div className="cursor cursor-assert grid-item" onClick={() => this.onSetAssertCursor(null) } ><div className="dots">&#8226;&#8226;&#8226;</div></div>
            ) : (
              <div className="add-row" onClick={() => this.onAddBlank(-1)}>+</div>
            )}
          </ActionDropMonitor>
          { ((isAssertMode || isRecording) && !_.isNumber(cursorIndex)) && (
            <div className={"record-cursor-container" + (isAssertMode ? " is-asserting" : "")}>
              <div className="record-cursor">
                <div className="record-cursor-bar"></div>
              </div>
            </div>
          )}
        </div>
        </div>
        <ReactTooltip place="top" type="dark" effect="solid" />
        {(!_.isEmpty(playbackResult) && !playbackCursor && activeResult) && (
          <ResultBubble />
        )}
      </div>
    )
  }

  onAssertModeChange() {
    const { isAssertMode } = this.props;
    if (isAssertMode) {
      Message.promise(Message.SESSION, "stopAsserting")
    } else {
      Message.promise(Message.SESSION, "startAsserting")
    }

  }

  onStartRecording() {
    Message.promise("startRecording");
  }

  onGetCode() {
    const { liveoutput } = this.props;
    Message.to(Message.SESSION, "setLiveOutput", !liveoutput);
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

  onResetPlayback() {
    Message.promise("clearActiveTestPlayback");
  }

  onPausePlayback() {
    Message.promise("pauseActiveTestPlayback");
  }

  onStartPlayback() {
    Message.promise("startActiveTestPlayback");
  }

  onResumePlayback() {
    Message.promise("resumeActiveTestPlayback");
  }

  onStepOver() {
    Message.promise("stepActiveTestPlayback");
  }

  onAddBlank(idx) {

    if (_.isNumber(idx) && idx > -1) {
      Message.to(Message.SESSION, "insertNWAction", { action: new Actions.BlankAction(), insertAt: idx});
    } else {
      Message.to(Message.SESSION, "insertNWAction", { action: new Actions.BlankAction()});
    }
  }

  onNWRowClick(action, idx) {

    const { recentSelectedIndex, selectedRows } = this.props;
    const { isShiftSelected } = this.state;
    const { actions = [] } = this.props.activeTest;


    if (isShiftSelected && (recentSelectedIndex > -1) && recentSelectedIndex !== idx ) {
      // doing a range

      try {

        var newSelectedRows = [];

        if (recentSelectedIndex < idx) {
          for (var i = recentSelectedIndex; i <= idx; i++) {
            newSelectedRows.push(actions[i].id);
          }
        } else {
          for (var i = idx; i <= recentSelectedIndex; i++) {
            newSelectedRows.push(actions[i].id);
          }
        }

        Message.to(Message.SESSION, "setSelectedRows", {selectedRows: newSelectedRows});
      } catch(e) { this.setState({isShiftSelected: false})}

    } else {
      // not doing a range

      var newSelectedRows = selectedRows.slice(0);
      var indexOfSelectedRow = newSelectedRows.indexOf(action.id);

      if (indexOfSelectedRow === -1) {
        newSelectedRows.push(action.id);
        Message.to(Message.SESSION, "setSelectedRows", {selectedRows: newSelectedRows, recentSelectedIndex: idx });
      } else {
        newSelectedRows.splice(indexOfSelectedRow, 1);
        Message.to(Message.SESSION, "setSelectedRows", {selectedRows: newSelectedRows, recentSelectedIndex: null });
      }

    }

  }

  onDeleteActions() {
    Message.to(Message.SESSION, "removeNWActions");
    Message.to(Message.SESSION, "clearSelectedRows");
  }

  onShiftDown() {
    this.setState({ isShiftSelected: true })
  }

  onShiftUp() {
    this.setState({ isShiftSelected: false })
  }

  onDismissWarnings() {
    Message.to(Message.SESSION, "dismissAllWarningsSelected")
  }

  onAddPathAssert() {
    Message.to(Message.SESSION, "addPathAssertSelected")
    Message.to(Message.SESSION, "clearSelectedRows");
  }

  onClearCacheOptimize() {

    const { activeTest } = this.props;

    if (activeTest.actions[0] && (activeTest.actions[0].type !== Actions.CLEAR_CACHES && activeTest.actions[0].type !== Actions.CLEAR_COOKIES))
      Message.to(Message.SESSION, "insertNWAction", { action: new Actions.ClearCachesAction("${baseUrl}"), insertAt: 0});

    Message.to(Message.SESSION, "clearSelectedRows");

  }

  onClearAllBreakpoints() {
    Message.to(Message.SESSION, "clearBreakpoints")
  }

  onBreakpointWarnings() {
    Message.to(Message.SESSION, "breakpointsToWarningsSelected")
  }

  onIndentSelected() {
    Message.to(Message.SESSION, "indentSelected")
  }

  onUnindentSelected() {
    Message.to(Message.SESSION, "unindentSelected")
  }

  onComment() {
    Message.to(Message.SESSION, "commentSelected")
  }

  onRollup() {
    Message.to(Message.SESSION, "createComponentFromSelectedRows")
    Message.to(Message.SESSION, "clearSelectedRows");
  }

  onAutoDescribe() {
    Message.to(Message.SESSION, "autodescribeSelectedRows");
    Message.to(Message.SESSION, "clearSelectedRows");
  }

  removeDescriptions() {
    Message.to(Message.SESSION, "removeDescriptionsSelectedRows");
  }

  shiftActionDown() {
    const { selectedRows } = this.props;
    Message.to(Message.SESSION, "shiftUpAction", selectedRows[0]);
  }

  shiftActionUp() {
    const { selectedRows } = this.props;
    Message.to(Message.SESSION, "shiftDownAction", selectedRows[0]);
  }

  onSetViewType(viewType, setAllRows = false) {
    if (setAllRows) {
      Message.to(Message.SESSION, "setActionViewTypeAllRows", viewType);
    } else {
      Message.to(Message.SESSION, "setActionViewTypeSelectedRows", viewType);
    }
  }

  onExpandAll() {
    const { selectedRows } = this.props;
    Message.to(Message.SESSION, "actionsExpand", selectedRows);
  }

  onShrinkAll() {
    const { selectedRows } = this.props;
    Message.to(Message.SESSION, "actionsShrink", selectedRows);
  }

  onSelectAll() {
    Message.to(Message.SESSION, "selectAllRows");
  }

  onClearSelected() {
    Message.to(Message.SESSION, "clearSelectedRows");
  }

  componentDidUpdate() {

    // logic for the screen to follow the playback cursor

    const { isPlayingBack, playbackCursor } = this.props;

    if (isPlayingBack && this.refs.actionlist && playbackCursor) {

      if (playbackCursor.indexOf("COMPONENT") === -1) {

        var latestAction = document.querySelector("[data-id=" + playbackCursor + "]");
        if (latestAction) {
          this.refs.actionlist.scrollTop = (latestAction.offsetTop - 500);
        }

      } else {
        var cursorTokens = playbackCursor.split("COMPONENT");

        var latestAction = document.querySelector("[data-id=" + playbackCursor + "]");
        var latestComponent = document.querySelector("[data-id=" + cursorTokens[0] + "]");

        if (latestAction && latestComponent) {
          this.refs.actionlist.scrollTop = ((latestAction.offsetTop + latestComponent.offsetTop) - 500);
        }

      }

    }

  }

  onAddVar(e) {
    e.preventDefault();
    var newVar = new StringVariable("foo", "bar");
    Message.to(Message.SESSION, "addVar", newVar);
  }

  onVarNameChange(variable, newName) {
    variable.name = newName;
    Message.to(Message.SESSION, "updateVar", variable);
  }

  onVarDefaultvalueChange(variable, newDefaultValue) {
    variable.defaultValue = newDefaultValue;
    Message.to(Message.SESSION, "updateVar", variable);
  }

  onVarDelete(variable) {
    Message.to(Message.SESSION, "deleteVar", variable);
  }

  onOutsideClick(e) {
    Message.to(Message.SESSION, "clearSelectedRows");
  }

  onClick(e) {
    if (this.props.actionSelectorId && e.path.filter((el) => el.classList && el.classList.contains("as-keepopen")).length === 0) {
      Message.to(Message.SESSION, "setActionSelectorId", null);
    }
  }

  onSaveDraft() {
    const { activeTest } = this.props;
    Message.to(Message.SESSION, "saveDraft", activeTest.id);
  }

  onDiscardDraft() {
    const { activeTest } = this.props;

    if (!activeTest.draftOf) {
      Message.to(Message.SESSION, "deleteTest", activeTest.id);
      Message.to(Message.SESSION, "pushRoute", new Route("dashboard") );
    } else {
      if (activeTest.type === "component") {
        Message.to(Message.SESSION, "setComponentActive", activeTest.draftOf);
        Message.to(Message.SESSION, "deleteTest", activeTest.id);
      } else {
        Message.to(Message.SESSION, "setTestActive", activeTest.draftOf);
        Message.to(Message.SESSION, "deleteTest", activeTest.id);
      }
    }

  }

}


class TestTagCheckbox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      processing: false
    }

  }

  render() {

    const { className = "", tag, testTags = [], testId} = this.props;
    const { processing } = this.state;
    const checked = testTags.indexOf(tag.id) !== -1;

    return (
      <label className={className}>
        {processing ? (
          <div className="loader"><div className="loader"></div></div>
        ) : (
          <input type="checkbox" checked={checked} onChange={(e) => this.onChange(e)}/>
        )}
        {tag.name}
      </label>
    )
  }

  onChange(e) {

    const { tag, testId } = this.props;

    this.setState({processing: true});

    var action = e.currentTarget.checked ? "linkTagsToTests" : "unlinkTagsToTests";

    Message.promise(action, {tagIds: [tag.id], testIds: [testId]}).then(() => {
      this.setState({processing: false});
    }).catch((e) => {
      this.setState({processing: false});
    });

  }

}


export default NWTestRecorder;
