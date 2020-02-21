import React from 'react'
import _ from 'lodash';
import {findNode } from '../../../util/treeUtils'
import Message from '../../../util/Message'
var sanitizeForFilename = require("sanitize-filename");
import {FRAMEWORK_OPTIONS} from '../../../models/frameworkconsts';

class NWCodeViewer extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const {activeTest, activeFolder, generatedCode = "",  directory, includeHarness, selectedFramework, selectedStyle, topDirName} = this.props;
    const isTest = !!activeTest;
    const isFolder = !!activeFolder && activeFolder !== "root";
    const isRoot = !!activeFolder && activeFolder === "root";
    const framework = _.find(FRAMEWORK_OPTIONS, {value: selectedFramework});
    const styles = framework ? framework.styles : [];
    const style = _.find(styles, {value: selectedStyle});

    var folderNode;
    if (isFolder) folderNode = findNode(directory.tree, {id: activeFolder});
    if (isRoot) folderNode = directory.tree;

    return (
      <div className="grid-row grid-item grid-column grid-noshrink code-content">
        <div className="grid-row grid-noshrink code-options">
          <div className="grid-item grid-row grid-column option-cont">
            <div className="grid-row v-align">
              <div className="option-label">Framework:</div>
              <div className="select-wrap">
                <select value={selectedFramework} onChange={(e) => this.onFrameworkChange(e.currentTarget.value)}>
                  {FRAMEWORK_OPTIONS.map((framework) => (
                      <option disabled={framework.disabled} value={framework.value}>{framework.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid-row v-align">
              <div className="option-label">Style:</div>
              <div className="select-wrap">
                <select value={selectedStyle} onChange={(e) => this.onStyleChange(e.currentTarget.value)}>
                  {styles.map((style) => (
                      <option disabled={style.disabled} value={style.value}>{style.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid-row v-align">
              <div className="option-label">Generating for: </div>
              {isRoot ? "All tests" : isFolder ? "(folder) " + folderNode.module : "(test) " + activeTest.name}
            </div>
            {(isFolder || isRoot) && ([
              <div className="grid-row v-align" key={0}>
                <div className="option-label">Top directory name:</div>
                <input type="text" className="text-input" placeholder={"snaptests"} value={topDirName} onChange={(e)=> Message.to(Message.SESSION, "setTopDirName", e.currentTarget.value)}/>
              </div>,
              <div className="grid-row v-align" key={1}>
                {style.definition.harnessCommand !== "" && ([
                    <div className="option-label" key={0}><label htmlFor="code-harness">Include harness</label></div>,
                    <input key={1} type="checkbox" id="code-harness" checked={includeHarness} onChange={(e) => this.onIncludeHarnessChange(e.currentTarget.checked)} />
                ])}
              </div>
            ])}
          </div>
          <div className="grid-item-2">
            <div className="generator-overview" >
              {style.definition.beta && (
                  <div className="beta-tag"><img className="beta-img" src={chrome.extension.getURL("assets/beta.png")} /></div>
              )}
              <div className="header">{style.definition.name}</div>
              <p>{style.definition.description}</p>
              {isTest ? (
                <div dangerouslySetInnerHTML={{ __html: style.definition.singleTest }}></div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: style.definition.multi }}></div>
              )}
            </div>
          </div>
        </div>
        {isTest && ([
          <div className="code-container ">
            <textarea className="code">{generatedCode}</textarea>
          </div>
        ])}
        {(isFolder || isRoot) && (
          <div>
            <a href="https://www.snaptest.io/doc/getting-started#prep-to-gen" target="_blank">View documentation on getting started with generated code.</a>
          </div>
        )}
        {(isFolder || isRoot) && (
          <div>
            {style.definition.cliSupport ? (
                <div>
                  <div className="code-section-header">Command: </div>
                  <div className="cli-container">
                    <span>{this.getCliCommand(isFolder, style)}</span>
                  </div>
                  <div className="code-section-header">Preview - these files folders will be generated:</div>
                  <div className="generated-preview">
                    {this.buildPreview(folderNode, isRoot)}
                  </div>
                </div>
            ) : (
              <h5>
                Project/folder generation not available for this style - view a single tests code to generate.
              </h5>
            )}
          </div>
        )}
      </div>
    )
  }

  getCliCommand(isFolder, style) {

    try {

      const { localmode, includeHarness, user, activeFolder, selectedFramework, selectedStyle, topDirName, contextType, contextId, tagTestFilters } = this.props;
      const apikey = user ? user.apikey : "";

      var harness = "";

      if (includeHarness) {
        harness = style.definition.harnessCommand;
      }

      return `${harness} snaptest ${ isFolder ? "-f " + activeFolder : ""} -r ${selectedFramework} -s ${selectedStyle} ${tagTestFilters.length > 0 ? " -e " + this.generateTagsArray() : ""} ${topDirName ? " -o " + topDirName : ""} ${ !localmode ? "-t " + apikey + " -a " + contextType + " -d " + contextId : "-i \<TESTJSON.json\>"}`;

    } catch(e) {
      return "ERROR finding CLI command."
    }

  }

  generateTagsArray() {
    const { tagTestFilters, testFilterOperator } = this.props;
    return `[${testFilterOperator === "AND" ? "1" : "0"},${tagTestFilters.join(",")}]`;
  }

  buildPreview(folderNode) {

    const { tests, topDirName } = this.props;

    function buildNode(node, isFirst) {

      var name;

      if (node.type === "test" && node.testId && _.find(tests, {id: node.testId})) {
        name = _.find(tests, {id: node.testId}).name;
      } else if (node && node.module) {
        name = node.module;
      }

      if (!name) return <div></div>

      return (
        <div className="node">

          {(isFirst) ? (
            topDirName ? topDirName : "snaptests"
          ) : (
            sanitizeForFilename(name)
          )}
          {isFirst && (
            <div className="boilerplate">common
              <div className="boilerplate">snaptest-nw-driver.js</div>
              <div className="boilerplate">components.js</div>
            </div>
          )}
          {isFirst && (
            <div className="boilerplate">
              tests
              {(node.children && node.children.length > 0) && (
                  (node.children.map((node) => <div>{buildNode(node)}</div>))
              )}
            </div>
          )}
          {!isFirst && (
            <div>
              {(node.children && node.children.length > 0) && (
                  (node.children.map((node) => <div>{buildNode(node)}</div>))
              )}
            </div>
          )}
        </div>
      );
    }

    return buildNode(folderNode, true)

  }

  onIncludeHarnessChange(value) {
    Message.to(Message.SESSION, "setIncludeHarness", value)
  }

  onFrameworkChange(framework) {
    Message.to(Message.SESSION, "setFramework", {framework: framework, style: _.find(FRAMEWORK_OPTIONS, {value: framework}).styles[0].value});
  }

  onStyleChange(style) {
    const { selectedFramework } = this.props;

    Message.to(Message.SESSION, "setFramework", {framework: selectedFramework, style: style});
  }

}

export default NWCodeViewer;
