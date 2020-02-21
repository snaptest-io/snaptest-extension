import React from 'react'
import _ from 'lodash'
import KeyHandler, {KEYPRESS} from 'react-key-handler';
import Message from '../../../util/Message'
import {Dropdown, Variable} from '../../'
import {StringVariable} from "../../../models/Variable";
import {SYSTEM_VARS} from '../../../models/Variable'
import ReactTooltip from 'simple-react-tooltip'
import AceEditor from 'react-ace';
import Headers from "./Headers";
import {SweetTextInput} from '../../../component';
var beautify = require('js-beautify').js_beautify;
require('brace/mode/json');
require('brace/theme/tomorrow');
require('brace/ext/language_tools');

class RequestEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      body: props.activeTest ? props.activeTest.body : "",
      isEditingBody: false,
      viewing: "body"
    }
  }

  componentWillUpdate(nextProps) {
    if (!this.state.isEditingBody && nextProps.activeTest && this.state.body !== nextProps.activeTest.body)
      this.setState({body: nextProps.activeTest.body})
  }

  render() {

    const {
      activeTest,
      viewTestDetails = false,
      isPlayingBack = false,
      recentRequestResult = null
    } = this.props;

    const { viewing } = this.state;

    if (!activeTest || activeTest.type !== "request") return null;

    return (
      <div className="RequestEditor">
        {viewTestDetails && (
          <div className="test-description">
            <div className="grid-row grid-column test-details">
              <div className="grid-row v-align detail-row">
                <div className="title-column">Description:</div>
                <div className="content-column grid-item">
                  <SweetTextInput placeholder="Describe the test... (hint: describe from a users points of view)"
                                  className="sweetinput-border description"
                                  onChange={(newValue)=> Message.to(Message.SESSION, "setCurrentTestDescription", newValue)}
                                  value={activeTest.description} />
                </div>
              </div>
              <div className="grid-row detail-row">
                <div className="title-column">
                  <div>Variables:</div>
                  <div><a onClick={(e) => this.onAddVar(e)}>+ Add</a></div>
                </div>
                <div className="grid-item content-column var-container">
                  {activeTest.variables.concat(SYSTEM_VARS).map((variable, idx) => (
                    <Variable name={variable.name}
                              system={variable.system}
                              value={variable.defaultValue}
                              onNameChange={(newName) => this.onVarNameChange(variable, newName)}
                              onValueChange={(newValue) => this.onVarDefaultvalueChange(variable, newValue)}
                              onDelete={() => this.onVarDelete(variable)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid-row grid-column request">
          <div className="grid-item int-label">Request:</div>
          <div className="grid-row v-align test-header-controls">
            <div className="grid-item grid-row request-head">
              <div className="method-select">
                <div className="select-wrap">
                  <select value={activeTest.method}
                          onChange={(e) => this.onChangeMethod(e) }>
                    <option value={"get"}>GET</option>
                    <option value={"post"}>POST</option>
                    <option value={"put"}>PUT</option>
                    <option value={"patch"}>PATCH</option>
                    <option value={"delete"}>DELETE</option>
                    <option value={"copy"}>COPY</option>
                    <option value={"head"}>HEAD</option>
                    <option value={"options"}>OPTIONS</option>
                  </select>
                </div>
              </div>
              <SweetTextInput value={activeTest.url}
                              className="url-input"
                              placeholder="..."
                              variables={activeTest.variables.map((variable) => "${" + variable.name + "}").concat(["${baseUrl}"])}
                              onChange={(newValue) => this.onChangeUrl(newValue)}/>
            </div>
            <button className={"btn btn-primary play-btn grid-row v-align" + (isPlayingBack ? " active" : "")}>
              <Dropdown classNames=""
                        onClick={(e) => e.stopPropagation()}
                        button={
                          <img className="down-arrow" src={chrome.extension.getURL("assets/darrow-thick-white.png")} />
                        }>
                <div>
                  <div className="dd-item grid-row" onClick={() => Message.to(Message.SESSION, "setPlaybackInterval", null)}>
                    <div className="grid-item">Send & Download</div>
                  </div>
                </div>
              </Dropdown>
              <div className="btn-label" onClick={() => !isPlayingBack ? this.onSend() : null}>
                <span>{!isPlayingBack ? "Send" : "Sending..."}</span>
              </div>
            </button>
          </div>

          <div className="grid-row v-align">
            <div className="grid-item int-label">Request Headers:</div>
            {/*<div onClick={() => this.onChangeHeaders(activeTest.headers.concat([{key: "", value: "value", enabled: true}]))}>+</div>*/}
          </div>
          <Headers headers={activeTest.headers} onChange={(headers) => this.onChangeHeaders(headers)}/>
          <div className="grid-row v-align">
            <div className="grid-item int-label">Request Body:</div>
            {/*<div>application/json</div>*/}
          </div>
          <AceEditor
            mode="json"
            theme="tomorrow"
            height={"200"}
            onChange={(value) => this.setState({body: value})}
            fontSize={11}
            width="100%"
            onBlur={() => this.onChangeBody(this.state.body)}
            onFocus={() => this.setState({isEditingBody: true})}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={false}
            value={this.state.body}
            setOptions={{
              "enableBasicAutocompletion": false,
              "enableLiveAutocompletion": false,
              "enableSnippets": false,
              "showLineNumbers": true,
              "tabSize": 2
            }}/>
        </div>
        {recentRequestResult && (
          <div className="response grid-item">
            <div className="grid-item int-label">Response body:</div>
            <AceEditor
              mode="json"
              theme="tomorrow"
              height={"200"}
              fontSize={11}
              width="100%"
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={false}
              value={beautify(recentRequestResult.body, { indent_size: 2 })}
              setOptions={{
                "enableBasicAutocompletion": false,
                "enableLiveAutocompletion": false,
                "enableSnippets": false,
                "showLineNumbers": true,
                "tabSize": 2
              }}/>
          </div>
        )}
        <ReactTooltip place="top" type="dark" effect="solid" />
      </div>
    )
  }

  onChangeMethod(e) {
    var request = this.props.activeTest;
    request.method = e.currentTarget.value;
    Message.to(Message.SESSION, "updateRequest", {request});
  }

  onChangeUrl(newValue) {
    var request = this.props.activeTest;
    request.url = newValue;
    Message.to(Message.SESSION, "updateRequest", {request});
  }

  onChangeHeaders(headers) {
    var request = this.props.activeTest;
    request.headers = headers;
    Message.to(Message.SESSION, "updateRequest", {request, optimized: true});
  }

  onChangeBody(newValue) {
    var request = this.props.activeTest;
    this.setState({isEditingBody: false}, () => {
      request.body = newValue;
      Message.to(Message.SESSION, "updateRequest", {request, optimized: true});
    });
  }

  onSend() {
    Message.promise("startActiveTestPlayback");
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

  onAddVar(e) {
    e.preventDefault();
    var newVar = new StringVariable("foo", "bar");
    Message.to(Message.SESSION, "addVar", newVar);
  }

}

export default RequestEditor;
