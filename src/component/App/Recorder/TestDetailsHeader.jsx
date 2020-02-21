import React from 'react'
import Message from '../../../util/Message'
import {Dropdown, EditableLabel, SweetTextInput} from '../../'
import Route from '../../../models/Route'
import ReactTooltip from 'simple-react-tooltip'

class TestDetailsHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { viewTestDescription, viewTestVars, currentRoute, lastRoute, activeTest, tags = [], testTags = [], tagIdtoNameMap, isMultiPane } = this.props;
    if (!activeTest) return null;

    return (
      <div className="TestDetailsHeader grid-row v-align">
        {isMultiPane && lastRoute && (lastRoute.name === "testbuilder" || lastRoute.name === "componentbuilder") ? (
          <svg className="svg-icon hoverable back-button"
               onClick={() => Message.to(Message.SESSION, "backRoute")}
               viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 9H4.41L8.7 4.71c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71l-6 6c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l6 6a1.003 1.003 0 0 0 1.42-1.42L4.41 11H18c.55 0 1-.45 1-1s-.45-1-1-1z" id="left_arrow_1_"/></svg>
        ) : (!isMultiPane) ? (
          <svg className="svg-icon hoverable back-button"
               onClick={() =>  Message.to(Message.SESSION, "backRoute")}
               viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 9H4.41L8.7 4.71c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71l-6 6c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l6 6a1.003 1.003 0 0 0 1.42-1.42L4.41 11H18c.55 0 1-.45 1-1s-.45-1-1-1z" id="left_arrow_1_"/></svg>
        ) : (
          <div></div>
        )}
        <div className="grid-item grid-row v-align" >
          <div className="header-tag grid-row v-align grid-item">
            {(currentRoute.name === "componentbuilder" && activeTest.draftOf) ? (
              <div className="square is-comp draft">Comp</div>
            ) : (currentRoute.name === "componentbuilder" && activeTest.draft) ? (
              <div className="square is-comp draft">Comp</div>
            ) : (currentRoute.name === "componentbuilder") ? (
              <div className="square is-comp">Comp</div>
            ) : activeTest.draftOf ? (
              <div className="square draft">Test</div>
            ) : activeTest.draft ? (
              <div className="square draft">Test</div>
            ) : (
              <div className="square">{activeTest.type}</div>
            )}
            <SweetTextInput value={activeTest.name}
                            onChange={(value) => Message.to(Message.SESSION, "setCurrentTestName", value)}
                            className="sweetinput-border test-header-name"
                            placeholder="..." />
            <div className="test-tags-cont">
              {testTags.map((tagId, idx) =>
                <div className="test-tag" key={idx}>
                  <svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
                  {tagIdtoNameMap[tagId]}
                </div>
              )}
            </div>
            {/*<div className="grid-row quick-buttons quick-button-dd test-detail-triggers">*/}
              {/*<div title="Descriptions" data-for="detail-header-tooltip" data-tip='View test descriptions.' onClick={() => Message.to(Message.SESSION, "setViewTestDescription", !viewTestDescription)}>*/}
                {/*<svg className={"svg-icon hoverable"} viewBox="0 0 20 20">*/}
                  {/*<path fill-rule="evenodd" clip-rule="evenodd" d="M9.41 13.41l7.65-7.65-2.83-2.83-7.65 7.65 2.83 2.83zm10-10c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2-.55 0-1.05.22-1.41.59l-1.65 1.65 2.83 2.83 1.64-1.66zM18 18H2V2h8.93l2-2H1C.45 0 0 .45 0 1v18c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7.07l-2 2V18zM4 16l4.41-1.59-2.81-2.79L4 16z"/>*/}
                {/*</svg>*/}
              {/*</div>*/}
              {/*<div title="Variables" data-for="detail-header-tooltip" data-tip='View test variables.'  onClick={() => Message.to(Message.SESSION, "setViewTestVars", !viewTestVars)}>*/}
                {/*<svg className={"svg-icon hoverable"} viewBox="0 0 20 20">*/}
                  {/*<path fill-rule="evenodd" clip-rule="evenodd" d="M4.93 3.79a9.1 9.1 0 0 1 2.2-2.27L7.29 1c-1.38.59-2.57 1.33-3.55 2.22C2.46 4.39 1.49 5.72.83 7.23.28 8.51 0 9.81 0 11.12c0 2.28.83 4.57 2.49 6.86l.16-.55c-.49-1.23-.73-2.38-.73-3.44 0-1.67.28-3.46.84-5.36.55-1.9 1.28-3.51 2.17-4.84zm9.38 8.39l-.33-.2c-.37.54-.65.87-.82 1a.74.74 0 0 1-.42.12c-.19 0-.38-.12-.57-.37-.31-.42-.73-1.59-1.26-3.5.47-.85.86-1.41 1.19-1.67.23-.19.48-.29.74-.29.1 0 .28.04.53.11.26.07.48.11.68.11.27 0 .5-.1.68-.29.18-.19.27-.44.27-.75 0-.33-.09-.58-.27-.77-.18-.19-.44-.29-.78-.29-.3 0-.59.07-.86.22s-.61.47-1.02.97c-.31.37-.77 1.02-1.37 1.94a9.683 9.683 0 0 0-1.24-3.14l-3.24.59-.06.36c.24-.05.44-.07.61-.07.32 0 .59.14.8.43.33.45.8 1.8 1.39 4.07-.47.64-.78 1.06-.96 1.26-.28.32-.52.53-.7.62-.14.08-.3.11-.48.11-.14 0-.36-.08-.67-.23-.21-.1-.4-.15-.57-.15-.31 0-.57.11-.78.32s-.31.48-.31.8c0 .31.09.55.28.75.19.19.44.29.76.29.31 0 .6-.07.87-.2s.61-.42 1.02-.86c.41-.44.98-1.13 1.7-2.08.28.9.52 1.56.72 1.97.2.41.44.71.7.89.26.18.59.27.99.27.38 0 .77-.14 1.17-.43.54-.36 1.07-1 1.61-1.91zM17.51 1l-.15.54c.49 1.24.73 2.39.73 3.45 0 1.43-.21 2.96-.63 4.6-.33 1.26-.75 2.45-1.27 3.55-.52 1.11-1.02 1.97-1.51 2.6-.49.62-1.09 1.2-1.8 1.72l-.17.53c1.38-.59 2.57-1.34 3.55-2.23 1.29-1.17 2.26-2.5 2.91-4 .55-1.28.83-2.59.83-3.91 0-2.27-.83-4.56-2.49-6.85z"/>*/}
                {/*</svg>*/}
              {/*</div>*/}
              {/*<ReactTooltip id='detail-header-tooltip' place="right" type="dark" effect="solid" />*/}
              {/*{!activeTest.draftOf && (*/}
                {/*<Dropdown button={*/}
                  {/*<div title="Tags" data-for="detail-header-tooltip" data-tip='Tag this test.'>*/}
                    {/*<svg className="svg-icon hoverable" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>*/}
                  {/*</div>*/}
                {/*}>*/}
                  {/*<div onClick={(e) => e.stopPropagation()}>*/}
                    {/*<div className="dd-header">Tag a Test</div>*/}
                    {/*{tags.map((tag, idx) => (*/}
                      {/*<TestTagCheckbox className="dd-item"*/}
                                       {/*key={idx}*/}
                                       {/*tag={tag}*/}
                                       {/*testTags={testTags}*/}
                                       {/*testId={activeTest.id}*/}
                                       {/*tagIdtoNameMap={tagIdtoNameMap} />*/}
                    {/*))}*/}
                    {/*{tags.length === 0 && (*/}
                      {/*<div className="dd-empty">*/}
                        {/*<div className="dd-empty-message">No tags created yet.</div>*/}
                      {/*</div>*/}
                    {/*)}*/}
                  {/*</div>*/}
                {/*</Dropdown>*/}
              {/*)}*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    )
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


export default TestDetailsHeader;
