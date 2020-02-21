import React from 'react'
import Message from '../util/Message.js'
import { Window } from '../component'
import {bindHotkeys, unbindHotkeys} from '../util/hotkeyManager';

class AppContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.initialState;
  }

  componentDidMount() {
    bindHotkeys.call(this);
  }

  componentWillUnmount() {
    unbindHotkeys.call(this);
  }

  componentWillMount() {
    Message.onMessageFor(Message.PANEL, (message) => {
      switch(message.action) {
        case "stateChange":
          this.setState(message.payload);
          break;
      }
    })
  }

  render() {

    const { viewStack, isRecording, isAssertMode, isPlayingBack, playbackCursor } = this.state;

    var currentRoute = viewStack[viewStack.length - 1];
    var enableTheButtons = (currentRoute.name === "testbuilder" || currentRoute.name === "componentbuilder") && !isPlayingBack;

    return (
      <Window { ...this.state } disableResize={true}>
        <div className="full-height grid-row v-align h-align mode-container">
          <button className={"btn assert-btn" + (isAssertMode ? " active" : "") + (!enableTheButtons ? " btn-disabled" : "" )} onClick={() => Message.promise(!isAssertMode ? "startAsserting" : "stopAsserting")}>
            Assert
          </button>
          <button className={"btn recording-btn " + (isRecording ? " active" : "") + (!enableTheButtons ? " btn-disabled" : "" )} onClick={() => Message.promise(!isRecording ? "startRecording" : "stopRecording")}>
            Record
          </button>
          <button className={"btn btn-primary play-btn" + (isPlayingBack ? " active" : "") + (!enableTheButtons ? " btn-disabled" : "" )} onClick={() => Message.promise("startActiveTestPlayback")}>
            {isPlayingBack ? "Running" : playbackCursor ? "Resume" : "Run" }
          </button>
          <button className="btn btn-primary" onClick={() => Message.to(Message.SESSION, "openWindow", true)}>
            SnapTest
          </button>
        </div>
      </Window>
    )

  }

}

export default AppContainer;