import React from 'react'
import ResultActionRow from "./ResultActionRow";
import Message from '../../../util/Message.js'
import Moment from 'moment'
import ViewPatch from './ViewPatch';
import UploadProgress from './UploadProgress'
import {buildTestsIdMap} from '../../../selectors/TestSelectors'
import Route from "../../../models/Route";

class ViewResult extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tests: [],
      csvs: {},
      viewing: "logs",
      screenshotCache: null,
      saving: false,
      savingError: null,
      resultFullscreen: false,
      expandedTests: []
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (!this.props.result) return;

    if (prevProps.result.id !== this.props.result.id) {
      this.loadResultContent(this.props.result);
    }
  }

  loadResultContent(result) {

    Message.promise("getScreenshotsCache").then((screenshotCache) => {
      this.setState({screenshotCache: screenshotCache})
    });

    if (result.content_id) {
      Message.promise("getResultContent", {
        ownerType: result.owner_type,
        ownerId: result.owner_id,
        contentId: result.content_id,
      }).then((content) => {

        const failingTests = content.tests.filter((test) => test.error).map((test) => test.testId);

        this.setState({
          expandedTests: failingTests,
          tests: content.tests.sort((a) => a.error ? -1 : 1),
          csvs: content.csvs
        })

      });
    } else if (result.content) {

      const failingTests = result.content.tests.filter((test) => test.error).map((test) => test.testId);

      this.setState({
        tests: result.content.tests.sort((a) => a.error ? -1 : 1),
        csvs: result.content.csvs,
        expandedTests: failingTests
      });

    }
  }

  componentDidMount() {
    const { result, tests } = this.props;

    this.testsByIdCache = buildTestsIdMap(tests);

    if (!result) return;

    this.loadResultContent(result);

  }

  render() {

    const { result, onClose = null, resultActionRowView, localmode, hideClose = false, resultUploaded = 0, resultTotal = 0, selectedOrg, runner, resultRunnerIdToEmailMap } = this.props;
    const { viewing, csvs, tests, screenshotCache, saving, savingError, resultFullscreen, expandedTests} = this.state;

    if (!result) return null;

    const { patches = [] } = result;
    const { passed } = this.getPatchedResults();
    const isPendingResult = !!result.content;

    return (
      <div className={"ViewResult" + (passed ? " passed" : " failed") + (resultFullscreen ? " full-screen" : "")}>
        {_.isFunction(onClose) && (
        <div className="upper-right">
          <div className="maximize" onClick={() => this.setState({resultFullscreen: !resultFullscreen})}>
            {!resultFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 0h-5c-.55 0-1 .45-1 1s.45 1 1 1h2.59L11.3 7.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71L18 3.41V6c0 .55.45 1 1 1s1-.45 1-1V1c0-.55-.45-1-1-1zM8 11c-.28 0-.53.11-.71.29L2 16.59V14c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55.45 1 1 1h5c.55 0 1-.45 1-1s-.45-1-1-1H3.41l5.29-5.29c.19-.18.3-.43.3-.71 0-.55-.45-1-1-1z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 11H3c-.55 0-1 .45-1 1s.45 1 1 1h2.59L.3 18.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71L7 14.41V17c0 .55.45 1 1 1s1-.45 1-1v-5c0-.55-.45-1-1-1zM20 1a1.003 1.003 0 0 0-1.71-.71L13 5.59V3c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55.45 1 1 1h5c.55 0 1-.45 1-1s-.45-1-1-1h-2.59l5.29-5.29c.19-.18.3-.43.3-.71z"/></svg>
            )}
          </div>
          {!hideClose && (
            <div className="dismiss"
                 onClick={() => onClose() }>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71 0-.55-.45-1-1-1-.28 0-.53.11-.71.29L10 8.59l-4.29-4.3C5.53 4.11 5.28 4 5 4c-.55 0-1 .45-1 1 0 .28.11.53.29.71L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71 0 .55.45 1 1 1 .28 0 .53-.11.71-.29l4.29-4.3 4.29 4.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71L11.41 10z" id="cross_mark_6_"/></svg>
            </div>
          )}
        </div>
        )}
        <div className="basic-info">
          <div className="bi-key-value">
            <div className="bi-key">Date & Time: </div>
            <div  className="bi-value">{Moment(result.created).format("MMM D h:mm:ss a")} {result.duration} ms ({parseInt(result.duration / 1000)} Seconds)</div>
          </div>
          <div className="bi-key-value">
            <div className="bi-key">Test name: </div>
            <div  className="bi-value">{result.name}</div>
          </div>
          {(selectedOrg && resultRunnerIdToEmailMap[result.runner_id]) && (
            <div className="bi-key-value">
              <div className="bi-key">Runner: </div>
              <div className={"bi-value"}>{resultRunnerIdToEmailMap[result.runner_id]}</div>
            </div>
          )}
          <div className="bi-key-value">
            <div className="bi-key">Result: </div>
            <div  className={"bi-value" + (passed ? " passed" : " failed")}>{passed ? "Passed" : "Failed"}</div>
          </div>
          <div className="grid-row v-align">
            {saving && (
              <button className="btn recording-btn saving">Saving... </button>
            )}
            {(isPendingResult && !localmode && !saving) && (
              saving ? (
                <button className="btn recording-btn saving" >Save result</button>
              ): (
                <button className="btn recording-btn" onClick={() => this.onSaveResult() }>Save result</button>
              )
            )}
            {savingError && (
              <div className="upload-error">{savingError}</div>
            )}
          </div>
        </div>
        <div className="tabs">
          <div className={"tab" + (viewing === "logs" ? " active" : "")} onClick={() => this.setState({viewing: "logs"})}>Logs</div>
          {!_.isEmpty(csvs) ? (
            <div className={"tab" + (viewing === "data" ? " active" : "")} onClick={() => this.setState({viewing: "data"})}>CSV/JSON</div>
          ) : (
            <div className={"tab disabled"}>CSVs</div>
          )}
          {patches.length > 0 ? (
            <div className={"tab" + (viewing === "patches" ? " active" : "")} onClick={() => this.setState({viewing: "patches"})}>Patches</div>
          ): (
            <div className={"tab disabled"}>Patches</div>
          )}
        </div>
        <div className="results-tabs-container">
          {viewing === "logs" ? (
            <div>
              <div className="grid-row btn-group">
                <div onClick={() => this.onExpandAllTests()} title="view actions" data-tip='Expand all folders' className="undo-redo-icon">
                  <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 9c.28 0 .53-.11.71-.29L10 3.41l5.29 5.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71l-6-6C10.53 1.11 10.28 1 10 1s-.53.11-.71.29l-6 6C3.11 7.47 3 7.72 3 8c0 .55.45 1 1 1zm12 2c-.28 0-.53.11-.71.29L10 16.59 4.71 11.3c-.18-.19-.43-.3-.71-.3-.55 0-1 .45-1 1 0 .28.11.53.29.71l6 6c.18.18.43.29.71.29s.53-.11.71-.29l6-6c.18-.18.29-.43.29-.71 0-.55-.45-1-1-1z" id="expand_all_2_"/></svg>
                </div>
                <div onClick={() => this.onCollapseAllTests()} title="view actions" data-tip='Collapse all folders' className="undo-redo-icon">
                  <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.29 8.71c.18.18.43.29.71.29s.53-.11.71-.29l6-6c.18-.18.29-.43.29-.71 0-.55-.45-1-1-1-.28 0-.53.11-.71.29L10 6.59l-5.29-5.3C4.53 1.11 4.28 1 4 1c-.55 0-1 .45-1 1 0 .28.11.53.29.71l6 6zm1.42 2.58c-.18-.18-.43-.29-.71-.29s-.53.11-.71.29l-6 6c-.18.18-.29.43-.29.71 0 .55.45 1 1 1 .28 0 .53-.11.71-.29l5.29-5.3 5.29 5.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71l-6-6z" id="collapse_all_2_"/></svg>
                </div>
                <div onClick={() => Message.promise("setResultActionRowView", {viewtype: "action"})} title="view actions" data-tip='View action details' className="undo-redo-icon">
                  <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm8-3H6c-3.31 0-6 2.69-6 6s2.69 6 6 6h8c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 11H6c-2.76 0-5-2.24-5-5s2.24-5 5-5h8c2.76 0 5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" id="Ellipse_2_6_"/></svg>
                </div>
                <div onClick={() => Message.promise("setResultActionRowView", {viewtype: "description"})} className="undo-redo-icon" title="view descriptions" data-tip='View descriptions'>
                  <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3v4a1.003 1.003 0 0 0 1.71.71l4.7-4.71H19c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM4 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" id="comment_1_"/></svg>
                </div>
              </div>
              {tests.map((testResult) => (
                <div className="test-results">
                  <div className="result-row-title grid-row v-align">
                    {expandedTests.indexOf(testResult.testId) !== -1 ? (
                      <svg onClick={() => this.onCollapseTest(testResult.testId)} className="svg-icon hoverable expand" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.71 12.29l-6-6C10.53 6.11 10.28 6 10 6s-.53.11-.71.29l-6 6a1.003 1.003 0 0 0 1.42 1.42L10 8.41l5.29 5.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71z" id="chevron_up_1_"/></svg>
                    ) : (
                      <svg onClick={() => this.onExpandTest(testResult.testId)} className="svg-icon hoverable expand" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 6c-.28 0-.53.11-.71.29L10 11.59l-5.29-5.3a1.003 1.003 0 0 0-1.42 1.42l6 6c.18.18.43.29.71.29s.53-.11.71-.29l6-6A1.003 1.003 0 0 0 16 6z" id="chevron_down_1_"/></svg>
                    )}
                    <div className={"square " + (testResult.error ? " failing" : " passing")}>test</div>
                    {this.testsByIdCache[testResult.testId] ? (
                      <a className="result-test-name" onClick={() => this.onClickTest(testResult.testId, result.env_id)}>{this.testsByIdCache[testResult.testId].name}</a>
                    ) : (
                      <div className="result-test-name">{testResult.name}</div>
                    )}
                    <div className="grid-item"></div>
                    <div className="result-test-duration">{testResult.duration}ms</div>
                  </div>
                  {(screenshotCache && expandedTests.indexOf(testResult.testId) !== -1) && testResult.results.map((result, idx) => (
                    <ResultActionRow key={idx}
                                     result={result}
                                     errorScreenshotUrl={testResult.error_ss}
                                     errorScreenshotUuid={testResult.error_ss_uuid}
                                     resultActionRowView={resultActionRowView}
                                     isPendingResult={isPendingResult}
                                     screenshotCache={screenshotCache} />
                  ))}
                </div>
              ))}
            </div>
          ) : viewing === "screenshots" ? (
            <div>
              Coming soon...
            </div>
          ) : viewing === "patches" ? (
            <div>
              {result.patches && result.patches.map((patch, idx) => (
                <ViewPatch key={idx} patch={patch} result={result} idx={idx} />
              ))}
            </div>
          ) : viewing === "data" ? (
            <div>
              {Object.keys(csvs).map((key) => (
                <div className="test-results">
                  <div className="csv-header grid-row">
                    <div className="csv-name">
                      {key} ({csvs[key].length} rows)
                    </div>
                    <div className="grid-item"></div>
                    <div className="download-link" onClick={() => this.onDownload(key, csvs[key], "csv")}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm4.71 11.71l-4 4c-.18.18-.43.29-.71.29s-.53-.11-.71-.29l-4-4C5.11 11.53 5 11.28 5 11c0-.55.45-1 1-1 .28 0 .53.11.71.29L9 12.59V5c0-.55.45-1 1-1s1 .45 1 1v7.59l2.29-2.29c.18-.19.43-.3.71-.3.55 0 1 .45 1 1 0 .28-.11.53-.29.71z" id="downlaod"/></svg>
                      Download as CSV
                    </div>
                    <div className="download-link" onClick={() => this.onDownload(csvs[key], "json")}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm4.71 11.71l-4 4c-.18.18-.43.29-.71.29s-.53-.11-.71-.29l-4-4C5.11 11.53 5 11.28 5 11c0-.55.45-1 1-1 .28 0 .53.11.71.29L9 12.59V5c0-.55.45-1 1-1s1 .45 1 1v7.59l2.29-2.29c.18-.19.43-.3.71-.3.55 0 1 .45 1 1 0 .28-.11.53-.29.71z" id="downlaod"/></svg>
                      Download as JSON
                    </div>
                  </div>
                  <table>
                    <thead>
                    {csvs[key].map((row, idx) => (idx > 0 ? null :
                        <tr>
                          {row.map((cell) => (
                            <th>{cell}</th>
                          ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {csvs[key].map((row, idx) => (idx === 0 ? null :
                        <tr>
                          {row.map((cell) => (
                            <td>{cell}</td>
                          ))}
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  onSaveResult() {

    this.setState({saving: true, savingError: null});

    Message.promise("savePendingResult").then(() => {
      setTimeout(() => {
        this.setState({ saving:false })
      }, 900);
    }).catch((e) => {
      this.setState({
        saving:false,
        savingError: _.isString(e.message) ? e.message : e
      })
    })

  }

  onClickTest(testId, envId) {
    Message.to(Message.SESSION, "setModal", null);
    if (envId) Message.to(Message.SESSION, "setSelectedDataProfile", envId);
    Message.to(Message.SESSION, "setTestActive", testId);
    Message.to(Message.SESSION, "pushRoute", new Route("testbuilder", {testId}))
  }

  getPatchedResults() {

    const { result } = this.props;
    const { patches = [] } = result;
    const patchedTests = patches.reduce((prev, next) => prev.concat(next.tests_passed), []);
    const allPassedTests = result.tests_passed.concat(patchedTests);

    return {
      passed: allPassedTests.length >= result.tests.length,
      tests_passed: allPassedTests
    }

  }

  onCollapseTest(testId) {

    var idx = this.state.expandedTests.indexOf(testId);

    if (idx !== -1) {
      this.state.expandedTests.splice(idx, 1);
      this.setState({expandedTests: this.state.expandedTests});
    }
  }

  onExpandTest(testId) {
    var idx = this.state.expandedTests.indexOf(testId);

    if (idx === -1) {
      this.state.expandedTests.push(testId)
      this.setState({expandedTests: this.state.expandedTests});
    }

  }

  onExpandAllTests() {
    const { tests } = this.state;
    this.setState({expandedTests: tests.map((test) => test.testId)});
  }

  onCollapseAllTests() {
    this.setState({expandedTests: []});
  }

  onDownload(name, rows, dlType) {

    if (dlType === "csv") {

      let csvContent = "data:text/csv;charset=utf-8,";
      rows.forEach(function(rowArray){
        rowArray = rowArray.map((cell) => `"${cell}"`);
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${name}.csv`);
      link.innerHTML= "Click Here to download";
      document.body.appendChild(link); // Required for FF

      link.click(); // This will download the data file named "my_data.csv".
      return;
    }

  }


}

export default ViewResult;
