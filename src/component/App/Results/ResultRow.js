import  React from 'react'
import Message from '../../../util/Message.js'
import Moment from 'moment'
import Route from "../../../models/Route";

class ResultRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpened: false
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isOpened && this.state.isOpened && this.refs.resultbody) {
      this.refs.resultbody.scrollTop = this.refs.resultbody.offsetHeight + 1000;
    }
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

  render() {

    const { result, contextType, contextId, contextIdToNameMap, resultRunnerIdToEmailMap, resultRunIdToNameMap, resultTagIdToNameMap, resultEnvIdToNameMap } = this.props;
    const { passed, tests_passed }= this.getPatchedResults();

    return (
      <div className={"ResultRow" + (result.archived ? " archived" : "")}>
        <div className="result-container grid-row grid-column">
          <div className="grid-row">
            <div className={"result grid-row grid-column v-align h-align" + (passed ? " success" : "")}  onClick={() => this.onViewResult(result)}>
              <div className="result-summary">{tests_passed.length}/{result.tests.length} <span className="test-lable">tests</span></div>
              <div className="result-date">{Moment(result.created).format("MMM D h:mma")}</div>
              <div className="result-date">{result.duration}ms</div>
            </div>
            <div className="result-details grid-item grid-row grid-column">
              <div className="result-name grid-row v-align">
                {result.name}
              </div>
              <div className="result-metas">
                {((contextType === "org" || contextType === "project") && result.runner_id) && (
                  <div className="result-meta runner"  title="runner">
                    <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10h-2c-.23 0-.42-.09-.59-.21l-.01.01-1.69-1.27-.63 3.14 2.62 2.62c.19.18.3.43.3.71v4c0 .55-.45 1-1 1s-1-.45-1-1v-3.59L9.39 12.8l-2.45 6.55h-.01c-.14.38-.5.65-.93.65-.55 0-1-.45-1-1 0-.12.03-.24.07-.35h-.01L9.43 7h-2.9l-1.7 2.55-.01-.01c-.18.27-.47.46-.82.46-.55 0-1-.45-1-1 0-.21.08-.39.18-.54l-.01-.01 2-3 .02.01C5.36 5.19 5.65 5 6 5h4.18l.36-.96c-.33-.43-.54-.96-.54-1.54a2.5 2.5 0 0 1 5 0A2.5 2.5 0 0 1 12.5 5c-.06 0-.12-.01-.18-.02l-.44 1.18L14.33 8H16c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
                    <div className="text">{resultRunnerIdToEmailMap[result.runner_id] || result.runner_id}</div>
                  </div>
                )}
                {contextType === "org" && (
                  <div className="result-meta project" title="project workspace">
                    <svg className="svg-icon" viewBox="0 0 20 20"><path d="M16.94 17a4.92 4.92 0 0 0-.33-1.06c-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15a3.648 3.648 0 0 1 1.4-2.36C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73a3.63 3.63 0 0 1 1.4 2.36c.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></svg>
                    {contextIdToNameMap[result.owner_type + result.owner_id]}
                  </div>
                )}
                {(result.run_id && resultRunIdToNameMap[result.run_id]) && (
                  <div className="result-meta run" title="run">
                    <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
                    {resultRunIdToNameMap[result.run_id]}
                  </div>
                )}
                {(result.env_id && resultEnvIdToNameMap[result.env_id]) && (
                  <div className="result-meta run" title="environment">
                    <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M.5 6.9l9 5c.2.1.3.1.5.1s.3 0 .5-.1l9-5c.3-.2.5-.5.5-.9s-.2-.7-.5-.9l-9-5c-.2-.1-.3-.1-.5-.1s-.3 0-.5.1l-9 5c-.3.2-.5.5-.5.9s.2.7.5.9z"/><path d="M19 9c-.2 0-.3 0-.5.1L10 13.9 1.5 9.1C1.3 9 1.2 9 1 9c-.6 0-1 .4-1 1 0 .4.2.7.5.9l9 5c.2.1.3.1.5.1s.3 0 .5-.1l9-5c.3-.2.5-.5.5-.9 0-.6-.4-1-1-1z"/><path d="M19 13c-.2 0-.3 0-.5.1L10 17.9l-8.5-4.7c-.2-.2-.3-.2-.5-.2-.6 0-1 .4-1 1 0 .4.2.7.5.9l9 5c.2.1.3.1.5.1s.3 0 .5-.1l9-5c.3-.2.5-.5.5-.9 0-.6-.4-1-1-1z"/></svg>
                    {resultEnvIdToNameMap[result.env_id]}
                  </div>
                )}
                {result.tag_ids && result.tag_ids.map((tagId, idx) => (
                  resultTagIdToNameMap[tagId] ? (
                    <div className="result-meta tag" key={idx}  title="multi-run with tag">
                      <svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
                      {resultTagIdToNameMap[tagId]}
                    </div>
                  ): (null)
                ))}
              </div>
            </div>
            <div className="grid-row v-align result-options">
              {(!passed && (contextId === "me" || result.owner_id === contextId)) && (
                <div className="grid-row v-align">
                  <button className="btn btn-with-icon" onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("patchrun", {result}))}>
                    <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8 4.44L16.13 8.1l-3.55-.71-.71-3.53L15.54.21c-2.01-.53-4.23-.03-5.8 1.53-1.86 1.85-2.23 4.6-1.14 6.83L.59 16.59C.22 16.95 0 17.45 0 18a2 2 0 0 0 2 2c.55 0 1.05-.22 1.41-.59l8.03-8.04c2.23 1.05 4.97.67 6.82-1.16 1.57-1.56 2.07-3.77 1.54-5.77z"/></svg>
                    Patch
                  </button>
                </div>
              )}
              <div className="grid-row v-align">
                <button className="btn btn-with-icon" onClick={() => this.onViewResult(result)}>
                  <svg viewBox="0 0 20 20"><path d="M10.01 7.984A2.008 2.008 0 0 0 8.012 9.99c0 1.103.9 2.006 1.998 2.006a2.008 2.008 0 0 0 1.998-2.006c0-1.103-.9-2.006-1.998-2.006zM20 9.96v-.03-.01-.02-.02a.827.827 0 0 0-.21-.442c-.64-.802-1.398-1.514-2.168-2.166-1.658-1.404-3.566-2.587-5.664-3.058a8.982 8.982 0 0 0-3.656-.05c-1.11.2-2.178.641-3.177 1.183-1.569.852-2.997 2.016-4.246 3.33-.23.25-.46.49-.67.761-.279.351-.279.773 0 1.124.64.802 1.4 1.514 2.169 2.166 1.658 1.404 3.566 2.577 5.664 3.058 1.209.271 2.438.281 3.656.05 1.11-.21 2.178-.651 3.177-1.193 1.569-.852 2.997-2.016 4.246-3.33.23-.24.46-.49.67-.751.11-.12.179-.271.209-.442v-.02-.02-.01-.03V10v-.04zM10.01 14A4.003 4.003 0 0 1 6.014 9.99a4.003 4.003 0 0 1 3.996-4.011 4.003 4.003 0 0 1 3.996 4.011 4.003 4.003 0 0 1-3.996 4.011z" fill-rule="nonzero"/></svg>
                  View
                </button>
              </div>
              {result.archived ? (
                <div className="action-delete grid-row v-align h-align">
                  <button className="btn btn-with-icon" onClick={() => this.onUnarchiveResult(result)} >
                    <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v2h16V4zm-2-3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v1h12V1zm3 6H1c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1zm-5 7c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2h1v2h6v-2h1v2z"/></svg>
                    Unarchive
                  </button>
                </div>
              ) : (
                <div className="action-delete grid-row v-align h-align">
                  <button className="btn btn-with-icon" onClick={() => this.onArchiveResult(result)} >
                    <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v2h16V4zm-2-3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v1h12V1zm3 6H1c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1zm-5 7c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2h1v2h6v-2h1v2z"/></svg>
                    Archive
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  onViewResult(result) {

    const { openInModal = false} = this.props;

    Message.promise("setActiveResult", {result});

    if (openInModal) Message.to(Message.SESSION, "setModal", {name: "view-results", meta: { result }});

  }

  onArchiveResult(result) {
    const { onArchiveResult = _.noop } = this.props;
    onArchiveResult(result);
  }

  onUnarchiveResult(result) {
    const { onUnarchiveResult = _.noop } = this.props;
    onUnarchiveResult(result);
  }

}

export default ResultRow;
