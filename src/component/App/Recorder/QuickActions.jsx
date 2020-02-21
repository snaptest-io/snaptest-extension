import React from 'react'
import Message from '../../../util/Message'

class QuickActions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      widgetHovered: false
    }

  }

  render() {

    const { action, isExpanded, component = null, onExplodeComponentClick, isInComponentAction = false, hideMoreInfo = false, hideDuplicate = false, hideDelete = false } = this.props;

    if (action.type === "COMPONENT" && isInComponentAction)
      return (
        <div className="action-quick-buttons h-align-right">
          <div className="quick-button" onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "toggleActionExpanded", action.id); }}>
            <img src={chrome.extension.getURL(isExpanded ? "assets/info_cancel.png" : "assets/info.png")}/>
          </div>
        </div>
      );
    else if (isInComponentAction) return null;

    return this.isVisible() ? (
      <div className="action-quick-buttons h-align-right">
        {component && (
          <div className="quick-button" onClick={(e) => { e.stopPropagation(); onExplodeComponentClick(component.id, action.id) }}>
            <img src={chrome.extension.getURL("assets/explode.png")} title="Spread component"/>
          </div>
        )}
        {!hideDelete && (
        <div className="quick-button" onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "removeNWAction", action.id); }}>
          <img src={chrome.extension.getURL("assets/trash.png")} />
        </div>
        )}
        {!hideDuplicate && (
          <a className="quick-button" onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "duplicateNWAction", action.id); }}>
            <img src={chrome.extension.getURL("assets/duplicate.png")} />
          </a>
        )}
        {!hideMoreInfo && (
          <div className="quick-button" onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "toggleActionExpanded", action.id); }}>
            <img src={chrome.extension.getURL(isExpanded ? "assets/info_cancel.png" : "assets/info.png")}/>
          </div>
        )}
      </div>
    ) : (
      <div className="action-quick-buttons h-align-right">
        {component && (
          <div className="quick-button" onClick={(e) => { e.stopPropagation(); onExplodeComponentClick(component.id, action.id) }}>
            <img src={chrome.extension.getURL("assets/explode.png")} title="Spread component"/>
          </div>
        )}
        {!hideDelete && (
          <div className="quick-button" onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "removeNWAction", action.id); }}>
            <img src={chrome.extension.getURL("assets/trash.png")} />
          </div>
        )}
        {!hideDuplicate && (
          <a className="quick-button" onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "duplicateNWAction", action.id); }}>
            <img src={chrome.extension.getURL("assets/duplicate.png")} />
          </a>
        )}
        {!hideMoreInfo && (
          <div className="quick-button" onClick={(e) => { e.stopPropagation(); Message.to(Message.SESSION, "toggleActionExpanded", action.id); }}>
            <img src={chrome.extension.getURL(isExpanded ? "assets/info_cancel.png" : "assets/info.png")}/>
          </div>
        )}
      </div>
    );

  }

  isVisible() {
    const { isExpanded, isSelectingForEl, isPlayingBack } = this.props;
    // return true;
    return (isExpanded || isSelectingForEl) && (!isPlayingBack);
  }


}

export default QuickActions;
