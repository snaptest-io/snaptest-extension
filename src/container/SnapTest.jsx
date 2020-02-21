import React from 'react'
import App from '../component/App/App';
import {bindHotkeys, unbindHotkeys} from '../util/hotkeyManager';
import {getInitialState} from "../initialState";
import Message from '../util/Message';

class SnapTest extends React.Component {

  constructor(props) {
    super(props);
    this.state = getInitialState();
  }

  componentDidMount() {
    bindHotkeys.call(this);
  }

  componentWillUnmount() {
    unbindHotkeys.call(this);
  }

  componentWillMount() {

    var backgroundPageConnection = chrome.runtime.connect({ name: "devtools-page"});

    backgroundPageConnection.onMessage.addListener(function (message) {

      if (message.payload.cause === "setHoverIndicator") return;

      switch(message.action) {
        case "stateChange":
          if (message.payload.testsExcluded) {
            this.setState({...message.payload, tests: this.state.tests});
          } else {
            this.setState(message.payload);
          }
          break;
        case "onActionResult":
          this.setState({playbackCursor: message.payload.playbackCursor});
          break;
      }
    }.bind(this));

    // get initial state;
    Message.promise("getUser").then(() => Message.promise("getTestData"));

  }

  render() {
    return <App {...this.state} {...this.props}/>
  }

}

export default SnapTest;