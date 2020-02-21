import React from 'react'
import _ from 'lodash'
import {Dropdown} from "../../index";
import Message from '../../../util/Message'

class TestFilters extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { tags, testFilterOperator, tagTestFilters, tagIdtoNameMap, onAddTagFilter = _.noop, toggleOperator= _.noop, onRemoveTagFilter = _.noop, hideFilterSvg = false} = this.props;

    return (
      <div className="TestFilters quick-button-dd">
        {!hideFilterSvg && (
          <div className="filter-type">
            {tagTestFilters.length > 0 ? (
              <svg className="svg-icon hoverable filter-svg" onClick={() => Message.promise("clearTestFilters")} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 2c0-.55-.45-1-1-1H1a1.003 1.003 0 0 0-.71 1.71L5 7.41V16a1.003 1.003 0 0 0 1.71.71l3-3c.18-.18.29-.43.29-.71V7.41l4.71-4.71c.18-.17.29-.42.29-.7zm2.91 13.5l1.79-1.79c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71l-1.79 1.79-1.79-1.79a1.003 1.003 0 0 0-1.42 1.42l1.79 1.79-1.79 1.79a1.003 1.003 0 0 0 1.42 1.42l1.79-1.79 1.79 1.79a1.003 1.003 0 0 0 1.42-1.42l-1.8-1.79z"/></svg>
            ) : (
              <svg className="svg-icon filter-svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 1H2a1.003 1.003 0 0 0-.71 1.71L7 8.41V18a1.003 1.003 0 0 0 1.71.71l4-4c.18-.18.29-.43.29-.71V8.41l5.71-5.71c.18-.17.29-.42.29-.7 0-.55-.45-1-1-1z"/></svg>
            )}
            <div>:</div>
          </div>
        )}
        <Dropdown className={"quick-buttons"} button={
          <div title="Tags" data-tip='Test Tags'>
            <svg className="svg-icon svg-with-stroke hoverable" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M0 5a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 0 9.588V5zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" /><path d="M11.5 3.5h6M14.5.5v6" stroke-linecap="square"/></g></svg>
          </div>
        }>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="dd-header">Add Tag Filter</div>
            {tags.map((tag, idx) => (
              <div key={idx} className="dd-item" onClick={() => onAddTagFilter(tag)}>
                <svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
                {tag.name}
              </div>
            ))}
            {tags.length === 0 && (
              <div className="dd-empty">
                <div className="dd-empty-message">No tags created yet.</div>
              </div>
            )}
          </div>
        </Dropdown>
        <div className="filter-tags grid-row v-align">
          {tagTestFilters.map((tagFilter, idx) => (
            <div className="grid-row v-align">
              <div className="test-tag" key={idx}>
                <svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
                {tagIdtoNameMap[tagFilter]}
                <svg onClick={() => onRemoveTagFilter(tagFilter)} className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71L10 8.59l-4.29-4.3a1.003 1.003 0 0 0-1.42 1.42L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l4.29-4.3 4.29 4.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71L11.41 10z"/></svg>
              </div>
              {idx < tagTestFilters.length - 1 && (
                <div className="operator" onClick={() => toggleOperator()}>{testFilterOperator}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

}

export default TestFilters;
