import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'
import {simulateWebhookIntegration} from '../../../util/integrations.js'
import {walkThroughTreeNodes, walkUpAncestors} from '../../../util/treeUtils'
import AceEditor from 'react-ace';
import TestFilters from "../../App/Dashboard/TestFilters";
require('brace/mode/json');
require('brace/theme/tomorrow');
require('brace/ext/language_tools');

const INTEGRATION_TYPES = { NONE: "NONE", WEBHOOK: "WEBHOOK" };

class CreateDataProfile extends React.Component {

  constructor(props) {
    super(props);

    const folders = this.getFolders();
    const { dataProfiles = []} = props;
    const defaultHeaders = this.getDefaultHeaders();
    const defaultBody = this.getDefaultBody();


    this.state = {
      name: "",
      selectedEnv: dataProfiles.length > 0 ? dataProfiles[0].profileId : "",
      selectedFolder: "all",
      selectedIntegration: INTEGRATION_TYPES.NONE,

      testFilterOperator: "AND",
      testTagFilters: [],

      simulateProcessing: false,
      simulateResponse: null,

      url: "https://hooks.slack.com/services/XXXXXX/XXXXXXX/XXXXXXXXXX",
      method: "post",
      headers: defaultHeaders,
      body: defaultBody
    }

  }

  componentDidMount() {
    const { editingRun, runs = []} = this.props;

    this.refs.name.focus();

    if (editingRun && _.find(runs, {id: editingRun})) {

      var run = _.find(runs, {id: editingRun});

      this.setState({

        editingRun: run,

        name: run.name,
        selectedEnv: run.env,
        selectedFolder: run.folder,
        selectedIntegration: run.integration.type,

        testFilterOperator: run.tags_and === 1 ? "AND" : "OR",
        testTagFilters: run.tags || [],

        url: run.integration.url,
        method: run.integration.method,
        headers: run.integration.headers,
        body: run.integration.body
      })

    }
  }

  getDefaultHeaders() {
    return `{
  "Content-Type": "application/json"
}`
  }

  getDefaultBody() {
    return `{
    "text": "Tests were a SMASHING \$\{stringMessage\}",
    "username":"A Snarky auto-tester",
    "icon_emoji": ":ghost:"
}`
  }

  render() {

    const { onClose = _.noop, dataProfiles = [], tagIdtoNameMap = {}, tags = []} = this.props;
    const folders = this.getFolders();
    const { selectedIntegration, selectedEnv, selectedFolder, name, error = null, simulateProcessing, simulateResponse, editingRun, testFilterOperator, testTagFilters } = this.state;
    const { url, method, headers, body } = this.state;

    return (
      <div className="create-data-profile">
        <form className="form grid-row grid-column" onSubmit={(e) => { e.preventDefault(); }}>
          {editingRun ? (
            <div className="title">Edit Run:</div>
          ) : (
            <div className="title">New Run:</div>
          )}
          <div className="grid-row">
            <div className="h-label grid-item grid-row v-align ">Name: </div>
            <div className="h-value grid-item-2">
              <input ref="name"
                     type="text"
                     className="text-input"
                     placeholder={`e.g. prod smoke, staging build tests`}
                     value={name}
                     onChange={(e) => this.setState({name: e.currentTarget.value})}/>
            </div>
          </div>
          <div className="grid-row">
            <div className="h-label grid-item grid-row v-align ">Folder: </div>
            <div className="h-value grid-item-2">
              {selectedFolder ? (
                <div className="select-wrap">
                  <select value={selectedFolder}
                          onChange={(e) => this.setState({selectedFolder: e.currentTarget.value})}>
                    <option value="all">... all folders ...</option>
                    {folders.map((folder, idx) => (
                      <option idx={idx} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="error-message grid-row v-align">Create a folder before making a run config.</div>
              )}
            </div>
          </div>
          <div className="grid-row">
            <div className="h-label grid-item grid-row v-align ">Tags: </div>
            <div className="h-value grid-item-2">
              <TestFilters tagTestFilters={testTagFilters}
                           tagIdtoNameMap={tagIdtoNameMap}
                           tags={tags}
                           testFilterOperator={testFilterOperator}
                           onAddTagFilter={(tag) => this.onAddTestTagFilter(tag)}
                           toggleOperator={() => this.onToggleOperator()}
                           onRemoveTagFilter={(tagFilter) => this.onRemoveTagFilter(tagFilter)}
                           hideFilterSvg />
            </div>
          </div>
          <div className="grid-row">
            <div className="h-label grid-item grid-row v-align ">Environment: </div>
            <div className="h-value grid-item-2">
              <div className="select-wrap">
                <select value={selectedEnv}
                        onChange={(e) => this.setState({selectedEnv: e.currentTarget.value})}>
                  <option value="">defaults</option>
                  {dataProfiles.map((profile, idx) => (
                    <option idx={idx} value={profile.profileId}>{profile.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="grid-row">
            <div className="h-label grid-item grid-row v-align ">Integration: </div>
            <div className="h-value grid-item-2">
              <div className="select-wrap">
                <select value={selectedIntegration}
                        onChange={(e) => this.setState({selectedIntegration: e.currentTarget.value})}>
                  <option value={INTEGRATION_TYPES.NONE}>None</option>
                  <option value={INTEGRATION_TYPES.WEBHOOK}>Webhook</option>
                </select>
              </div>
            </div>
          </div>
          {selectedIntegration === INTEGRATION_TYPES.WEBHOOK && (
            <div className="grid-row grid-column integration">
              <div className="grid-row">
                <div className="method-select">
                  <div className="select-wrap">
                    <select value={method}
                            onChange={(e) => this.setState({method: e.currentTarget.value})}>
                      <option value={"post"}>POST</option>
                      <option value={"put"}>PUT</option>
                      <option value={"get"}>GET</option>
                      <option value={"delete"}>DELETE</option>
                    </select>
                  </div>
                </div>
                <div className="grid-item-3">
                  <input ref="url"
                         type="text"
                         className="text-input"
                         placeholder={`https://www.example.com/mywebhook`}
                         value={url}
                         onChange={(e) => this.setState({url: e.currentTarget.value})}/>
                </div>
              </div>
              <div className="int-label">Headers: (JSON)</div>
              <AceEditor
                mode="json"
                theme="tomorrow"
                height="100"
                onChange={(value) => this.setState({headers: value})}
                fontSize={11}
                width="100%"
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={false}
                value={headers}
                setOptions={{
                  "enableBasicAutocompletion": false,
                  "enableLiveAutocompletion": false,
                  "enableSnippets": false,
                  "showLineNumbers": false,
                  "tabSize": 2
                }}/>
              <div className="int-label">Body: (JSON)</div>
              <AceEditor
                mode="json"
                theme="tomorrow"
                height={"150"}
                onChange={(value) => this.setState({body: value})}
                fontSize={11}
                width="100%"
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={false}
                value={body}
                setOptions={{
                  "enableBasicAutocompletion": false,
                  "enableLiveAutocompletion": false,
                  "enableSnippets": false,
                  "showLineNumbers": false,
                  "tabSize": 2
                }}/>
              <a target="_blank" href="https://www.snaptest.io/doc/runs#integrations">What are my options here?</a>
              <div className="grid-row button-group left-aligned">
                <button className="btn btn-secondary"
                        type="button"
                        onClick={() => this.onSimulateWebhook(true)}>Simulate Success</button>
                <button className="btn btn-secondary"
                        type="button"
                        onClick={() => this.onSimulateWebhook(false)}>Simulate Failure</button>
              </div>
              {simulateResponse && (
                <div className="simulation-response">{simulateResponse}</div>
              )}
            </div>
          )}
          {error && (
            <div className="grid-row error-message">
              {error}
            </div>
          )}
          <div className="grid-row button-row">
            <div className="grid-row button-group left-aligned">
              {editingRun ? (
                <button className="btn btn-primary"
                        disabled={simulateProcessing}
                        onClick={() => this.onSubmit() }>Save</button>
              ) : (
                <button className="btn btn-primary"
                        disabled={simulateProcessing}
                        onClick={() => this.onSubmit() }>Add Run</button>
              )}
              <button className="btn btn-secondary"
                      disabled={simulateProcessing}
                      type="button"
                      onClick={() => onClose() }>Cancel</button>
            </div>
            <div className="grid-item"></div>
            <div className="grid-row button-group">
              {editingRun && (
                <button className="btn btn-delete"
                        type="submit"
                        disabled={simulateProcessing}
                        onClick={() => this.onDelete() }>Delete</button>
              )}
            </div>
          </div>
        </form>
      </div>
    )
  }

  onAddTestTagFilter(tag) {

    var { testTagFilters } = this.state;

    var existingTagIdx = testTagFilters.indexOf(tag.id);

    if (existingTagIdx === -1) {
      this.state.testTagFilters.push(tag.id);
      this.setState(this.state)
    }

  }

  onRemoveTagFilter(tagFilterId) {

    var { testTagFilters } = this.state;

    var existingTagIdx = testTagFilters.indexOf(tagFilterId);

    if (existingTagIdx !== -1) {
      testTagFilters.splice(existingTagIdx, 1);
      this.setState(this.state)
    }

  }

  onToggleOperator() {
    this.setState({ testFilterOperator: this.state.testFilterOperator === "AND" ? "OR" : "AND" })
  }

  onDelete() {
    const { editingRun } = this.state;
    const { onClose } = this.props;
    Message.promise("deleteRun", {id: editingRun.id}).then(() => onClose());
  }

  onSimulateWebhook(success) {

    const { url, headers, method, body } = this.state;

    this.setState({simulateProcessing: true, simulateResponse: null});

    simulateWebhookIntegration(url, headers, method, body, success)
      .then((result) => {
        this.setState({simulateProcessing: false, simulateResponse: result})
      })
      .catch((e) => {
        this.setState({simulateProcessing: false, simulateResponse: e})
      });

  }

  getFolders() {

    const { directory } = this.props;

    var folders = [];

    walkThroughTreeNodes(directory.tree, (node) => {
      if (!node.type && !node.topLevel && !node.testId) {

        var directories = node.module;

        walkUpAncestors(directory.tree, node.id, (node) => {
          if (node.module !== "tests" && !node.topLevel) directories = node.module + " -> " + directories;
        });

        folders.push({name: directories, id: node.id});

      }
    });

    return folders;

  }

  onSubmit() {

    const { onClose } = this.props;
    const { name, selectedFolder, selectedEnv, selectedIntegration, testTagFilters, editingRun, testFilterOperator } = this.state;
    const { url, headers, method, body } = this.state;

    if (!name) {
      this.setState({error: "Please add a name."});
    }
    else if (!selectedFolder) {
        this.setState({ error: "No folder selected." });
    } else {

      if (!editingRun) {

        Message.promise("createRun", {
          name,
          folder: selectedFolder,
          tags: testTagFilters,
          tags_and: testFilterOperator === "AND" ? 1 : 0,
          env: selectedEnv,
          integration: {
            type: selectedIntegration,
            url,
            headers,
            method,
            body
          }
        });

      } else {
        Message.promise("updateRun", {
          id: editingRun.id,
          name,
          folder: selectedFolder,
          tags: testTagFilters,
          tags_and: testFilterOperator === "AND" ? 1 : 0,
          env: selectedEnv,
          integration: {
            type: selectedIntegration,
            url,
            headers,
            method,
            body
          }
        });
      }

      onClose();
    }
  }

}

export default CreateDataProfile;
