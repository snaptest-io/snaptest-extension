import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'
import ResultRow from './ResultRow'
import ResultChart from './ResultChart'
import ResultFilters from './ResultFilters'
import ViewResult from "./ViewResult";
import {hasResultFiltersApplied} from '../../../selectors/resultFilterSelectors'


class Results extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      results: [],
      continues: false,
      resultsOverview: [],
      loadingResults: false,
      wideScreen: false,
      exporting: false
    }
  }

  componentDidMount() {
    this.onLoadResults(true);
    this.debouncedOnResize = _.debounce(this.onResize.bind(this), 16);
    window.addEventListener("resize", this.debouncedOnResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedOnResize);
  }

  onResize() {
    if (window.innerWidth > 1000) this.setState({wideScreen: true});
    else this.setState({wideScreen: false});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contextType !== nextProps.contextType
      || this.props.contextId !== nextProps.contextId) this.onLoadResults(true);
  }

  onLoadResults(includeResultMetadata) {

    const { localmode, contextType, projects } = this.props;

    if (localmode) return null;

    this.setState({loadingResults: true});

    var promises = [
      Message.promise("getResults"),
      Message.promise("getResultsOverview")
    ];

    const handleResponse = (response) => {
      var results = response[0].results;
      var continues = response[0].continues;
      var resultsOverview = response[1];

      this.setState({results, continues, resultsOverview, loadingResults: false});
    }

    if (includeResultMetadata) {

      promises.push(Message.promise("getResultRunners"));
      promises.push(Message.promise("getResultEnvs"));
      promises.push(Message.promise("getResultRuns"));
      promises.push(Message.promise("getResultTags"));

      if (contextType === "org" || contextType === "project") {
        promises.push(Message.promise("getCollaborators"));
      }

      if (contextType === "org" && projects.length === 0) {
        Message.promise("getProjects").then(() => Promise.all(promises)).then(handleResponse);
      } else {
        Promise.all(promises).then(handleResponse);
      }

    } else {
      Promise.all(promises).then(handleResponse);
    }
    
  }

  onLoadMoreResults() {
    Message.promise("getMoreResults", {offset: this.state.results.length}).then((response) => {
      var newResults = response.results;
      var continues = response.continues;

      this.setState({
        results: this.state.results.concat(newResults),
        continues
      })
    })
  }

  getContextIdToNameMap() {

    const { projects, selectedOrg } = this.props;

    var map = {
      ["org" + selectedOrg.id]: selectedOrg.name,
    };

    projects.forEach((project) => {
      map["project" + project.id] = project.name;
    });

    return map;

  }

  render() {

    if (this.props.localmode) return (
      <div className="content full-height grid-row v-align h-align">
        <div className="EmptyState large">
          <div className="EmptyState large">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 7c-.12 0-.24.03-.36.04C13.83 4.69 11.62 3 9 3 5.69 3 3 5.69 3 9c0 .05.01.09.01.14C1.28 9.58 0 11.13 0 13c0 2.21 1.79 4 4 4h11c2.76 0 5-2.24 5-5s-2.24-5-5-5z" id="cloud"/></svg>
            <div className="ni-header">Persisted Results available in Cloud Accounts.</div>
          </div>
        </div>
      </div>
    );

    var { results, resultsOverview, loadingResults, wideScreen, continues, exporting } = this.state;
    const { resultFilters, resultView, contextType, contextId, activeResult, showResultGraph, tagIdtoNameMap, resultRunnerIdToEmailMap, resultRunIdToNameMap, resultTagIdToNameMap, resultEnvIdToNameMap } = this.props;
    const runIdToNameMap = this.getRunIdToNameMap();
    const contextIdToNameMap = contextType === "org" ? this.getContextIdToNameMap() : {}

    return (
      <div className="ResultsPage grid-item grid-row grid-column results-container">
        <div className="results-head grid-row">
          <div className="grid-item">
            {showResultGraph && (
              <ResultChart resultFilters={resultFilters}
                           resultsOverview={resultsOverview}
                           showResultGraph={showResultGraph} />
            )}
          </div>
          <div className={"result-chart-options" + (showResultGraph ? " chart-open" : "")}>
            {(!loadingResults && results.length > 0 && !exporting) ? (
              <div className="export" onClick={() => this.onGenerateCSV()} >
                <svg className="svg-icon hoverable view-test-details"  viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7c.28 0 .53-.11.71-.29L9 3.41V15c0 .55.45 1 1 1s1-.45 1-1V3.41l3.29 3.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71l-5-5C10.53.11 10.28 0 10 0s-.53.11-.71.29l-5 5A1.003 1.003 0 0 0 5 7zm14 7c-.55 0-1 .45-1 1v3H2v-3c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/></svg>
              </div>
            ) : (
              <div className="export disabled">
                <svg className="svg-icon hoverable view-test-details"  viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7c.28 0 .53-.11.71-.29L9 3.41V15c0 .55.45 1 1 1s1-.45 1-1V3.41l3.29 3.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71l-5-5C10.53.11 10.28 0 10 0s-.53.11-.71.29l-5 5A1.003 1.003 0 0 0 5 7zm14 7c-.55 0-1 .45-1 1v3H2v-3c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/></svg>
              </div>
            )}
            {showResultGraph ? (
              <div onClick={() => Message.to(Message.SESSION, "setShowResultGraph", false)} title="Show Result Graph" data-tip='Filter Tests' className="undo-redo-icon">
                <svg className="svg-icon hoverable active view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 16h1c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1zm7 1H1c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1zm-3-1h1c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1zm-9 0h1c.55 0 1-.45 1-1v-5c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1zm-4 0h1c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v13c0 .55.45 1 1 1z"/></svg>
              </div>
            ) : (
              <div onClick={() => Message.to(Message.SESSION, "setShowResultGraph", true)} title="Filter Tests" data-tip='Filter Tests' className="undo-redo-icon">
                <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 16h1c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1zm7 1H1c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1zm-3-1h1c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1zm-9 0h1c.55 0 1-.45 1-1v-5c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1zm-4 0h1c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v13c0 .55.45 1 1 1z"/></svg>
              </div>
            )}
          </div>
        </div>
        <div className="results-body">
          <div className="results-body-left">
            <ResultFilters {...this.props}
                           loadResults={() => this.onLoadResults() }
                           runIdToNameMap={runIdToNameMap}
                           contextIdToNameMap={contextIdToNameMap} />
            {loadingResults ? (
              <div className="result-list grid-item grid-row v-align h-align">
                <h4><div className="loader"></div></h4>
              </div>
            ) : results.length > 0 ? (
              <div className="result-list grid-item">
              {results.map((result, idx) => (
                <ResultRow key={idx}
                           result={result}
                           resultView={resultView}
                           onArchiveResult={(result) => this.onArchiveResult(result.id)}
                           onUnarchiveResult={(result) => this.onUnarchiveResult(result.id)}
                           openInModal={!wideScreen}
                           runIdToNameMap={runIdToNameMap}
                           tagIdtoNameMap={tagIdtoNameMap}
                           contextIdToNameMap={contextIdToNameMap}
                           resultRunnerIdToEmailMap={resultRunnerIdToEmailMap}
                           resultRunIdToNameMap={resultRunIdToNameMap}
                           resultTagIdToNameMap={resultTagIdToNameMap}
                           resultEnvIdToNameMap={resultEnvIdToNameMap}
                           contextType={contextType}
                           contextId={contextId} />
              ))}
              {continues && (
                <div className="on-results-continue">
                  <button className="btn btn-primary" onClick={() => this.onLoadMoreResults()}>Load more...</button>
                </div>
              )}
              </div>
            ) : (
              <div className="result-list grid-item grid-row v-align h-align">
                <h4>No results recorded.</h4>
              </div>
            )}
          </div>
          {(activeResult && !activeResult.patch_of && wideScreen) && (
            <div className="results-body-right">
              <ViewResult {...this.props}
                          result={activeResult}
                          onClose={() => Message.promise("setActiveResult", {result: null})} />
            </div>
          )}
        </div>
      </div>
    );
  }

  getRunIdToNameMap() {
    const { runs } = this.props;
    var runNameMap = {};

    runs.forEach((run) => {
      runNameMap[run.id] = run.name;
    });

    return runNameMap;
  }

  onArchiveResult(resultId) {
    Message.promise("archiveResult", {resultId}).then(() => {

      var indexOfResult = _.findIndex(this.state.results, {id: resultId});

      this.state.results[indexOfResult].archived = true;

      this.setState(this.state);

    });
  }

  onUnarchiveResult(resultId) {
    Message.promise("unarchiveResult", {resultId}).then(() => {

      var indexOfResult = _.findIndex(this.state.results, {id: resultId});

      this.state.results[indexOfResult].archived = false

      this.setState(this.state);

    });
  }

  onGenerateCSV() {

    const { results, continues } = this.state;

    if (!continues) {
      this.generateCsv(results);
    } else {

      this.setState({exporting: true});

      // get the rest of the data.
      Message.promise("getAllResults").then((results) => {
        this.generateCsv(results);
      }).finally(() => {
        this.setState({exporting: false});
      });
    }

  }

  generateCsv(results) {
    const { resultRunnerIdToEmailMap, resultRunIdToNameMap, contextType, resultEnvIdToNameMap } = this.props;
    const contextIdToNameMap = contextType === "org" ? this.getContextIdToNameMap() : {};

    var columnHeaders = [
      "date", "person", "project", "environment", "run_name", "tests_passed", "tests_failed", "tests_total", "duration_ms", "type", "patch_count"
    ];

    const rows = [columnHeaders].concat(results.map((result) => {

      var patch_tests_passed = result.patches ? result.patches.reduce((last, next) => last + next.tests_passed.length, 0) : 0;
      var tests_passed = result.tests_passed_num + patch_tests_passed;
      var tests_failed = result.tests_num - tests_passed;
      var patch_count = result.patches ? result.patches.length : 0;

      return [
        result.created,
        resultRunnerIdToEmailMap[result.runner_id] || `${result.runner_id} (removed)`,
        contextType === "org" ? contextIdToNameMap[result.owner_type + result.owner_id] || (`${result.owner_type}:${result.owner_id}`) : "",
        result.env_id ? (resultEnvIdToNameMap[result.env_id] || `${result.env_id} (removed)`) : "",
        result.type === "run" ? (resultRunIdToNameMap[result.run_id] || `${result.run_id} (removed)`) : "",
        tests_passed,
        tests_failed,
        tests_passed + tests_failed,
        result.duration,
        result.type,
        patch_count
      ]

    }));

    let csvContent = "data:text/csv;charset=utf-8," + rows.map(cell => cell.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var now = new Date();

    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `test-results-${now.toISOString()}.csv`);
    // document.body.appendChild(link); // Required for FF

    link.click();
  }

}

export default Results;
