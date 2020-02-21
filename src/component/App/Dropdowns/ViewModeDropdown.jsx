import React from 'react'
import Message from '../../../util/Message'
import {Dropdown, Icon} from '../../../component'

class ViewModeDropdown extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { isAutoSaving, isDevtool } = this.props;

    return (
      <div className="view-mode-dd">
        {isDevtool && (
          <button className="btn btn-primary" onClick={() => Message.to(Message.SESSION, "openWindow", true)}>
            popout
          </button>
        )}
        {isAutoSaving && (<div className="auto-saving">Autosaving...</div>)}
      </div>
    )
  }

}



export default ViewModeDropdown;
