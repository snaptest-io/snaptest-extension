import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message'
import Route from '../../../models/Route'
import MoveEnvDropdown from "../DataProfiles/MoveEnvDropdown/MoveEnvDropdown";
import ReactTooltip from 'simple-react-tooltip'

class TagsManage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Message.promise("getTags");
  }

  render() {

    var { tags = [], isSwitchingContext } = this.props;

    const tagItem = (tag, idx) => (
      <div key={idx} className={"tag-list-item block-list-item grid-row v-align" + (tag.inherited ? " inherited" : "")} >
        <div className="test-tag">
          <svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
          {tag.inherited ? (
            <div>{tag.name}</div>
          ) : (
            <a onClick={() => this.onEditTag(tag.id)}>{tag.name}</a>
          )}
        </div>
        <div className="grid-item"></div>
        {!tag.inherited ? (
          <div className="grid-row v-align" onClick={() => !tag.inherited ? this.onEditTag(tag.id) : null}>
            <svg className="svg-icon hoverable"  viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 8h-2.31c-.14-.46-.33-.89-.56-1.3l1.7-1.7a.996.996 0 0 0 0-1.41l-1.41-1.41a.996.996 0 0 0-1.41 0l-1.7 1.7c-.41-.22-.84-.41-1.3-.55V1c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2.33c-.48.14-.94.34-1.37.58L5 2.28a.972.972 0 0 0-1.36 0L2.28 3.64c-.37.38-.37.99 0 1.36L3.9 6.62c-.24.44-.44.89-.59 1.38H1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2.31c.14.46.33.89.56 1.3L2.17 15a.996.996 0 0 0 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l1.7-1.7c.41.22.84.41 1.3.55V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.33c.48-.14.94-.35 1.37-.59L15 17.72c.37.37.98.37 1.36 0l1.36-1.36c.37-.37.37-.98 0-1.36l-1.62-1.62c.24-.43.45-.89.6-1.38H19c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-9 6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" id="cog_2_"/></svg>
          </div>
        ) : (
          <div className="grid-row v-align">
            <svg viewBox="0 0 20 20" className="svg-icon svg-icon-lock" data-tip="Editing locked." data-for="locked-tooltip">
              <path id="lock_1_" d="M15.93,9H14V4.99c0-2.21-1.79-4-4-4s-4,1.79-4,4V9H3.93C3.38,9,3,9.44,3,9.99v8C3,18.54,3.38,19,3.93,19h12
              c0.55,0,1.07-0.46,1.07-1.01v-8C17,9.44,16.48,9,15.93,9z M8,9V4.99c0-1.1,0.9-2,2-2s2,0.9,2,2V9H8z"/>
            </svg>
            <ReactTooltip id="locked-tooltip" place="top" type="dark" effect="solid" />
          </div>
        )}
      </div>
    );

    return (
      <div className="grid-item grid-row grid-column block-list TagsManage">
        <div className="header-row grid-row v-align">
          <div className="grid-item"></div>
          <div className="grid-row v-align">
            <button className="btn assert-btn"
                    onClick={() => this.onNewTag()}>+ New Tag</button>
            {/*<a target="_blank" href="https://www.snaptest.io/doc/tags">*/}
              {/*<svg className="svg-icon hoverable" viewBox="0 0 20 20"><path id="help_1_" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM7.41 4.62c.65-.54 1.51-.82 2.56-.82.54 0 1.03.08 1.48.25.44.17.83.39 1.14.68.32.29.56.63.74 1.02.17.39.26.82.26 1.27s-.08.87-.24 1.23c-.16.37-.4.73-.71 1.11l-1.21 1.58c-.14.17-.28.33-.32.48-.05.15-.11.35-.11.6v.97H9v-2s.06-.58.24-.81l1.21-1.64c.25-.3.41-.56.51-.77s.14-.44.14-.67c0-.35-.11-.63-.32-.85s-.5-.33-.88-.33c-.37 0-.67.11-.89.33-.22.23-.37.54-.46.94-.03.12-.11.17-.23.16l-1.95-.29c-.12-.01-.16-.08-.14-.22.13-.93.52-1.67 1.18-2.22zM9 14h2.02L11 16H9v-2z"/></svg>*/}
            {/*</a>*/}
          </div>
        </div>
        {isSwitchingContext ? (
          <div className="content-loading"><div className="loader"></div></div>
        ) : tags.length === 0 ? (
          <div className="grid-item grid-row grid-column v-align h-align">
            <h4>No tags yet!</h4>
            {/*<div>*/}
              {/*<a target="_blank" href="https://www.snaptest.io/doc/tags">What are tags?</a>*/}
            {/*</div>*/}
          </div>
        ) : (
          <div>
            {tags.map((tag, idx) => tagItem(tag, idx))}
          </div>
        )}
      </div>
    )
  }

  onNewTag() {
    Message.promise("setEditingTag", {tagId: null});
    Message.to(Message.SESSION, "setModal", "create-tag")
  }

  onEditTag(tagId) {
    Message.promise("setEditingTag", {tagId});
    Message.to(Message.SESSION, "setModal", "create-tag")
  }

}

export default TagsManage;
