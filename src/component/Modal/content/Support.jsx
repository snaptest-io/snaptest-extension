import React from 'react'
import Message from '../../../util/Message.js'

class Support extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="support-modal grid-row">
        <div className="grid-row grid-column">
          <div className="grid-item grid-row v-align h-align support-section">
            <div>Need more help? <a target="_blank" href="https://www.snaptest.io">Visit our website for tutorials</a> or <a target="_blank" href="https://www.youtube.com/channel/UCi8nyq-b-tgmL4JU0gFU2BQ">check out our youtube channel</a>.</div>
          </div>
          <div className="grid-item grid-row v-align h-align support-section">
            <div>Want to do the tutorial again? <a onClick={(e) => this.onTutorialStart(e) }>Click here.</a></div>
          </div>
          <div className="grid-item grid-row v-align h-align support-section">
            <div>Generate Example tests (local mode only) <a onClick={(e) => Message.to(Message.SESSION, "generateExamples") }>Click here.</a></div>
          </div>
          <div className="grid-item grid-row v-align h-align support-section">
            <div>Find a bug? <a target="_blank" href="https://github.com/ozymandias547/snaptest/issues">Log it here.</a></div>
          </div>
          <div className="grid-item grid-row v-align h-align support-section">
            <div>Please take some time to <a target="_blank" href="https://www.surveymonkey.com/r/TZ2ZBWX">fill out the feature survey.</a></div>
          </div>
          <div className="grid-item grid-row v-align h-align support-section">
            <div>Want to contact us directly?  Email us at <a href="mailto:joseph@snaptest.io">joseph@snaptest.io</a> or <a href="mailto:michael@snaptest.io">michael@snaptest.io</a>.</div>
          </div>
        </div>
      </div>
    )
  }

  onTutorialStart(e) {
    e.preventDefault();
    Message.to(Message.SESSION, "setTutStep", 0);
    Message.to(Message.SESSION, "setTutActive", true);
  }

}

export default Support;
