import React from 'react'
import Message from '../../../util/Message'
import {findNode, walkUpAncestors, walkThroughTreeNodes } from '../../../util/treeUtils'
import Test from '../../../models/Test'
import Component from '../../../models/Component'
import Request from '../../../models/Request'
import Route from '../../../models/Route'
import _ from 'lodash'
import ReactTooltip from 'simple-react-tooltip'
import Directory from './Directory/Directory'
import {getAccountType} from '../../../util/UserUtils'
import {getFilteredTestsInfo, hasFiltersApplied} from '../../../util/TestFilterUtils'
import TestFilters from "./TestFilters";


class DashboardContent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Message.promise("getSettings");
  }

  render() {

    const { drafts, userSettings, localmode, isSwitchingContext, positionCreateButtonsTop = false, showTestFilters, tagTestFilters, tags, testFilterOperator, tagIdtoNameMap, showSelectedTest = false } = this.props;

    const directoryProps = {
      directory: this.props.directory,
      testFilters: this.getNodesToShow(),
      tests: this.props.tests,
      components: this.props.components,
      openFolders: this.props.openFolders,
      localmode: this.props.localmode,
      user: this.props.user,
      plan: this.props.plan,
      premium: this.props.premium,
      orgAccounts: this.props.orgAccounts,
      selectedTestId: showSelectedTest ? (this.props.activeTest ? this.props.activeTest.id : null) : null,
    };

    const accountType = getAccountType(this.props);

    if (accountType === "user" && !this.props.premium) {
      return <div className="grid-item grid-row grid-column db-content-2">
        <div className="EmptyState">
          <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 7c-.12 0-.24.03-.36.04C13.83 4.69 11.62 3 9 3 5.69 3 3 5.69 3 9c0 .05.01.09.01.14C1.28 9.58 0 11.13 0 13c0 2.21 1.79 4 4 4h11c2.76 0 5-2.24 5-5s-2.24-5-5-5z" id="cloud"/></svg>
          <div className="ni-header">Your cloud account has expired.</div>
          <div className="ni-cta-buttons">
            <a className="btn recording-btn" target="_blank" href="https://www.snaptest.io/premium">Renew account</a>
            <button className="btn assert-btn" onClick={() => Message.to(Message.SESSION, "setModal", "export")}>Export test data</button>
          </div>
        </div>
      </div>
    };

    return (
      <div className="grid-item grid-row grid-column db-content-2">
        {positionCreateButtonsTop && (
          <div className="grid-row create-buttons-top">
            {tagTestFilters.length > 0 ? (
              <div>
                <button className="btn recording-btn new-test btn-disabled">+ test</button>
                <button className="btn assert-btn new-comp btn-disabled">+ component</button>
                {/*<button className="btn assert-btn new-req disabled">+ request</button>*/}
              </div>
            ): (
              <div>
                <button className="btn recording-btn new-test" onClick={() => this.onStartNewTest()}>+ test</button>
                <button className="btn assert-btn new-comp" onClick={() => this.onStartNewComponent()}>+ component</button>
                {/*<button className={"btn assert-btn new-req"} onClick={() => this.onStartNewRequest()}>+ request</button>*/}
              </div>
            )}
          </div>
        )}

          <div className="grid-row btn-group top-buttons">
            <div onClick={() => this.onAddTestTreeFolder()} title="view actions" data-tip='Add folder' className="undo-redo-icon">
              <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 17c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7H0v10zM19 4H9.41l-1.7-1.71C7.53 2.11 7.28 2 7 2H1c-.55 0-1 .45-1 1v3h20V5c0-.55-.45-1-1-1z" id="folder_close_1_"/></svg>
            </div>
            <div onClick={() => this.onExpandAll()} title="view actions" data-tip='Expand all folders' className="undo-redo-icon">
              <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 9c.28 0 .53-.11.71-.29L10 3.41l5.29 5.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71l-6-6C10.53 1.11 10.28 1 10 1s-.53.11-.71.29l-6 6C3.11 7.47 3 7.72 3 8c0 .55.45 1 1 1zm12 2c-.28 0-.53.11-.71.29L10 16.59 4.71 11.3c-.18-.19-.43-.3-.71-.3-.55 0-1 .45-1 1 0 .28.11.53.29.71l6 6c.18.18.43.29.71.29s.53-.11.71-.29l6-6c.18-.18.29-.43.29-.71 0-.55-.45-1-1-1z" id="expand_all_2_"/></svg>
            </div>
            <div onClick={() => this.onCollapseAll()} title="view actions" data-tip='Collapse all folders' className="undo-redo-icon">
              <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.29 8.71c.18.18.43.29.71.29s.53-.11.71-.29l6-6c.18-.18.29-.43.29-.71 0-.55-.45-1-1-1-.28 0-.53.11-.71.29L10 6.59l-5.29-5.3C4.53 1.11 4.28 1 4 1c-.55 0-1 .45-1 1 0 .28.11.53.29.71l6 6zm1.42 2.58c-.18-.18-.43-.29-.71-.29s-.53.11-.71.29l-6 6c-.18.18-.29.43-.29.71 0 .55.45 1 1 1 .28 0 .53-.11.71-.29l5.29-5.3 5.29 5.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71l-6-6z" id="collapse_all_2_"/></svg>
            </div>
            <div onClick={() => this.onViewAllCode()} title="view actions" data-tip='Generate code' className="undo-redo-icon">
              <svg className="svg-icon hoverable view-test-details" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 6c0-.55-.45-1-1-1-.28 0-.53.11-.71.29l-4 4C.11 9.47 0 9.72 0 10c0 .28.11.53.29.71l4 4c.18.18.43.29.71.29.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71L2.41 10 5.7 6.71c.19-.18.3-.43.3-.71zm6-4c-.46 0-.83.31-.95.73l-4 14c-.02.09-.05.17-.05.27 0 .55.45 1 1 1 .46 0 .83-.31.95-.73l4-14c.02-.09.05-.17.05-.27 0-.55-.45-1-1-1zm7.71 7.29l-4-4C15.53 5.11 15.28 5 15 5c-.55 0-1 .45-1 1 0 .28.11.53.29.71l3.3 3.29-3.29 3.29c-.19.18-.3.43-.3.71 0 .55.45 1 1 1 .28 0 .53-.11.71-.29l4-4c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71z" id="code_1_"/></svg>
            </div>
            <div onClick={() => this.onAllPlayback()} title="Multi-playback debug run" data-tip='Multi-playback debug run' className="undo-redo-icon">
              <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z"/></svg>
            </div>
            {showTestFilters ? (
              <div onClick={() => this.onCloseFilters()} title="Filter Tests" data-tip='Filter Tests' className="undo-redo-icon">
                <svg className="svg-icon hoverable active view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 1H2a1.003 1.003 0 0 0-.71 1.71L7 8.41V18a1.003 1.003 0 0 0 1.71.71l4-4c.18-.18.29-.43.29-.71V8.41l5.71-5.71c.18-.17.29-.42.29-.7 0-.55-.45-1-1-1z"/></svg>
              </div>
            ) : (
              <div onClick={() => this.onOpenFilters()} title="Filter Tests" data-tip='Filter Tests' className="undo-redo-icon">
                <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 1H2a1.003 1.003 0 0 0-.71 1.71L7 8.41V18a1.003 1.003 0 0 0 1.71.71l4-4c.18-.18.29-.43.29-.71V8.41l5.71-5.71c.18-.17.29-.42.29-.7 0-.55-.45-1-1-1z"/></svg>
              </div>
            )}
            {localmode && (
              <div onClick={() => Message.to(Message.SESSION, "setModal", "import")} title="Load tests" data-tip='Import test JSON' className="undo-redo-icon">
                <svg className="svg-icon hoverable view-test-details" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.29 15.71c.18.18.43.29.71.29s.53-.11.71-.29l5-5c.18-.18.29-.43.29-.71 0-.55-.45-1-1-1-.28 0-.53.11-.71.29L11 12.59V1c0-.55-.45-1-1-1S9 .45 9 1v11.59l-3.29-3.3C5.53 9.11 5.28 9 5 9c-.55 0-1 .45-1 1 0 .28.11.53.29.71l5 5zM19 14c-.55 0-1 .45-1 1v3H2v-3c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z" id="import_1_"/></svg>
              </div>
            )}
            <div onClick={() => Message.to(Message.SESSION, "setModal", "export")} title="Save tests" data-tip='Export test JSON' className="undo-redo-icon">
              <svg className="svg-icon hoverable view-test-details" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7c.28 0 .53-.11.71-.29L9 3.41V15c0 .55.45 1 1 1s1-.45 1-1V3.41l3.29 3.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71l-5-5C10.53.11 10.28 0 10 0s-.53.11-.71.29l-5 5C4.11 5.47 4 5.72 4 6c0 .55.45 1 1 1zm14 7c-.55 0-1 .45-1 1v3H2v-3c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z" id="export_1_"/></svg>
            </div>
            <div className="grid-item"></div>
            {!positionCreateButtonsTop && ([
              <div>
                {tagTestFilters.length > 0 ? (
                  <div>
                    <button className="btn recording-btn new-test btn-disabled">+ new test</button>
                    <button className="btn assert-btn new-comp btn-disabled">+ component</button>
                  </div>
                ): (
                  <div>
                    <button className={"btn recording-btn new-test"} onClick={() => this.onStartNewTest()}>+ new test</button>
                    <button className={"btn assert-btn new-comp"} onClick={() => this.onStartNewComponent()}>+ component</button>
                  </div>
                )}
              </div>
            ])}
          </div>

        <div className="grid-item directory-content">
          {(userSettings.drafts && drafts.length > 0) && (
            <div className="drafts">
              <div className="drafts-title">Unsaved Changes:</div>
              {drafts.map((draft) => this.getTestRow(draft, true))}
            </div>
          )}
          {showTestFilters && (
            <TestFilters tagTestFilters={tagTestFilters}
                         tagIdtoNameMap={tagIdtoNameMap}
                         tags={tags}
                         testFilterOperator={testFilterOperator}
                         onAddTagFilter={(tag) => this.onAddTestTagFilter(tag)}
                         toggleOperator={() => Message.promise("toggleTestFilterOperator")}
                         onRemoveTagFilter={(tagFilter) => Message.promise("removeTagTestFilter", {tagId: tagFilter})} />
          )}
          {isSwitchingContext ? (
            <div className="content-loading"><div className="loader"></div></div>
          ) : (this.props.tests.length === 0 && this.props.components.length === 0 && this.props.directory.tree.children.length === 0) ? (
            <div className="EmptyState">
              <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 9c0-.55-.45-1-1-1H5c-.43 0-.79.27-.93.65h-.01l-3 8h.01c-.04.11-.07.23-.07.35 0 .55.45 1 1 1h14c.43 0 .79-.27.93-.65h.01l3-8h-.01c.04-.11.07-.23.07-.35zM3.07 7.63C3.22 7.26 3.58 7 4 7h14V5c0-.55-.45-1-1-1H8.41l-1.7-1.71C6.53 2.11 6.28 2 6 2H1c-.55 0-1 .45-1 1v12.31l3.07-7.68z" id="folder_open_1_"/></svg>
              <div className="ni-header">You haven't created any tests yet.</div>
              <div className="ni-cta-buttons">
                <button className="btn recording-btn" onClick={() => this.onStartTutorial()}>Start tutorial</button>
                {localmode && (
                  <button className="btn assert-btn" onClick={() => this.onGenerateExamples()}>Get some examples</button>
                )}
              </div>
            </div>
          ) : (
            <Directory {...directoryProps} />
          )}
        </div>
        <ReactTooltip place="top" type="dark" effect="solid" />
      </div>
    )
  }

  onAddTestTagFilter(tag) {
    Message.promise("toggleTagTestFilter", {tagId: tag.id})
  }

  onGenerateExamples() {
    Message.to(Message.SESSION, "generateExamples");
    Message.to(Message.SESSION, "setHasFamiliarized", true)
  }

  onStartTutorial() {
    Message.to(Message.SESSION, "setTutStep", 1);
    Message.to(Message.SESSION, "setTutActive", true);
    Message.to(Message.SESSION, "setHasFamiliarized", true);
  }

  onAddTestTreeFolder() {
    Message.to(Message.SESSION, "addTestFolder");
    this.forceUpdate();
  }

  onExpandAll() {
    Message.to(Message.SESSION, "expandAllFolders");
  }

  onCollapseAll() {
    Message.to(Message.SESSION, "collapseAllFolders");
  }

  getNodesToShow() {

    var { directory, tagTestFilters, testsInTagsMap, testFilterOperator} = this.props;

    if (hasFiltersApplied(tagTestFilters)) {

      var filteredInfo = getFilteredTestsInfo(directory, tagTestFilters, testsInTagsMap, testFilterOperator)

      return {
        filtered: true,
        nodeIds: filteredInfo.nodeIds,
        testIds: filteredInfo.testIds
      }
    }
    else {
      return {
        filtered: false
      }
    }

  }

  getTestRow(test) {
    return (
        <div className={"test-row" + (test.type === "component" ? " is-component" : "")}>
          <div className="item" onMouseDown={(e) => this.checkForHandle(e) }>
            <div className="grid-row v-align">
              { (test.type === "component" && test.draftOf) ? (
                <div className="square is-comp draft" onClick={(e) => {e.stopPropagation(); this.onViewTest(test)}} >Comp Edit</div>
              ) : (test.type === "component" && test.draft) ? (
                <div className="square is-comp draft" onClick={(e) => {e.stopPropagation(); this.onViewTest(test)}}>New Comp</div>
              ) : (test.type === "component") ? (
                <div className="square is-comp handle">Comp</div>
              ) : test.draftOf ? (
                <div className="square draft" onClick={(e) => {e.stopPropagation(); this.onViewTest(test)}}>Test Edit</div>
              ) : test.draft ? (
                <div className="square draft" onClick={(e) => {e.stopPropagation(); this.onViewTest(test)}}>New Test</div>
              ) : (
                <div className="square handle">Test</div>
              )}
              <div className="grid-item">
                <a onClick={() => this.onViewTest(test)}>{test.name}</a>
              </div>
            </div>
            {test.draftOf && (
              <div className="draftof-indicator">
                <div className="draftof-name">
                  of: {this.getFolderBreadcrumb(test)}
                </div>
              </div>
            )}
            <div className="save-drafts-cont">
              <button className={"btn btn-primary"}
                      onClick={(e) => { this.onSaveDraft(test)}} title="Run test">Save</button>
              <button className={"btn btn-delete"}
                      onClick={(e) => { this.onDeleteDraft(test); }} title="Run test">Discard</button>
            </div>
          </div>
        </div>
    )
  }

  getFolderBreadcrumb(test) {

    const { tests, components, directory } = this.props;

    var directories = "";
    var draftOfTest = _.find(test.type === "component" ? components : tests, {id: test.draftOf});
    var testName = draftOfTest ? draftOfTest.name : "unknown...";

    if (draftOfTest) {
      var directoryNode = findNode(directory, {testId: draftOfTest.id});
      if (!directoryNode) return testName;

      walkUpAncestors(directory.tree, directoryNode.id, (node) => {
        if (node.module !== "tests") directories = node.module + " --> " + directories;
      });

      return directories + testName;

    } else {
      return null;
    }

  }

  checkForHandle(e) {
    if (e.srcElement.className.indexOf("handle") === -1) {
      e.stopPropagation();
    }
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  onDeleteDraft(test) {
    if (test.type === "component") {
      Message.to(Message.SESSION, "setComponentActive", test.draftOf);
      Message.to(Message.SESSION, "deleteComponent", test.id, () => this.forceUpdate());
    } else {
      Message.to(Message.SESSION, "setTestActive", test.draftOf);
      Message.to(Message.SESSION, "deleteTest", test.id, () => this.forceUpdate());
    }
  }

  onSaveDraft(test) {
    Message.to(Message.SESSION, "saveDraft", test.id);
    this.forceUpdate();
  }

  onViewTest(test) {
    if (test.type === "component") {
      Message.to(Message.SESSION, "setComponentActive", test.id);
      Message.to(Message.SESSION, "pushRoute", new Route("componentbuilder", { componentId: test.id } ) );
    } else {
      Message.to(Message.SESSION, "setTestActive", test.id);
      Message.to(Message.SESSION, "pushRoute", new Route("testbuilder", { testId: test.id } ) );
    }
  }

  onRunTest(test) {
    Message.to(Message.SESSION, "setTestActive", test.id);
    Message.to(Message.SESSION, "pushRoute", new Route("testbuilder", { testId: test.id } ) );
    Message.promise("startActiveTestPlayback");
  }

  onViewCode(test) {
    Message.to(Message.SESSION, "setTestActive", test.id);
    Message.to(Message.SESSION, "pushRoute", new Route("codeviewer"));
  }

  onViewAllCode() {
    Message.to(Message.SESSION, "setFolderActive", "root");
    Message.to(Message.SESSION, "pushRoute", new Route("codeviewer"));
  }

  onAllPlayback() {
    var { directory, tagTestFilters, testsInTagsMap, testFilterOperator} = this.props;
    if (hasFiltersApplied(tagTestFilters)) {
      var testsToRun = getFilteredTestsInfo(directory, tagTestFilters, testsInTagsMap, testFilterOperator).testIds;
      Message.to(Message.SESSION, "pushRoute", new Route("multiplayback", {testsToRun, folderString: "filtered"}));
    } else {
      Message.to(Message.SESSION, "pushRoute", new Route("multiplayback", {testsToRun: null, folderString: "all"}));
    }
  }

  onOpenFilters() {
    Message.promise("showTestFilters");
  }

  onCloseFilters() {
    Message.promise("hideTestFilters").then(() => Message.promise("clearTestFilters"));
  }

  onStartNewTest() {
    var newTest = new Test();
    Message.to(Message.SESSION, "addNewTest", newTest);
  }

  onStartNewComponent() {
    var component = new Component();
    Message.to(Message.SESSION, "addNewComponent", component);
  }

  onStartNewRequest() {
    var request = new Request();
    Message.to(Message.SESSION, "addNewTest", request);
  }

}

export default DashboardContent;
