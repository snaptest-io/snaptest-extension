import React from 'react'
import Message from '../../../util/Message'

class ActDesToggle extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { showComment, action, showWarnings = false, hideDescription = false } = this.props;

    if (hideDescription) return null;

    return (
      <div className="grid-row" onClick={(e) => this.onActDescToggle(e) }>
        {showWarnings && action.warnings.length > 0 && (
          <div className="warning-announce"
               onClick={(e) => this.onWarningClick(e)}>!</div>
        )}
        <div className="action-desc-toggle">
          {showComment ? (
            <svg className="svg-icon hoverable view-test-details view-desc" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3v4a1.003 1.003 0 0 0 1.71.71l4.7-4.71H19c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM4 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" id="comment_1_"/></svg>
          ): (
            <svg className="svg-icon hoverable view-test-details view-act" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm8-3H6c-3.31 0-6 2.69-6 6s2.69 6 6 6h8c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 11H6c-2.76 0-5-2.24-5-5s2.24-5 5-5h8c2.76 0 5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" id="Ellipse_2_6_"/></svg>
          )}
        </div>
      </div>
    )
  }

  onWarningClick(e) {
    const { action } = this.props;
    e.stopPropagation();
    Message.to(Message.SESSION, "toggleActionExpanded", action.id);
  }

  onActDescToggle(e) {
    const { action } = this.props;
    e.stopPropagation();
    Message.to(Message.SESSION, "toggleCommentedAction", action.id);
  }

}

export default ActDesToggle;
