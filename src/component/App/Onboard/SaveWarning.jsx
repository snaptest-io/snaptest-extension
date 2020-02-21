import React from 'react'
import Message from '../../../util/Message'
import Route from '../../../models/Route'

class SaveWarning extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { tests, components, localmode, user, saveWarningActivated } = this.props;

    return ((tests.length > 0 || components.length > 0) && localmode && saveWarningActivated) ? (
      <div className="SaveWarning">
        <div className="grid-row v-align">
          <div className="grid-item grid-row v-align">
            <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7c.28 0 .53-.11.71-.29L9 3.41V15c0 .55.45 1 1 1s1-.45 1-1V3.41l3.29 3.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71l-5-5C10.53.11 10.28 0 10 0s-.53.11-.71.29l-5 5C4.11 5.47 4 5.72 4 6c0 .55.45 1 1 1zm14 7c-.55 0-1 .45-1 1v3H2v-3c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z" id="export_1_"/></svg>Don't forget to export your test JSON while in local mode.
          </div>
          <div className="reminder-link" onClick={() => Message.to(Message.SESSION, "setSaveWarningActivated", false)} >Ok</div>
          {!user && (
            <div className="reminder-link" onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("auth"))}>Get Cloud Mode</div>
          )}
        </div>
      </div>
    ) : null;
  }

}

export default SaveWarning;
