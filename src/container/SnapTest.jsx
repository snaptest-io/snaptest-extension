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

    Message.onMessageForAsync(Message.PANEL, (message, payload) => {
      return new Promise(resolve => {
        if (message.action === "eval") {
          return performEval(payload).then(result => {
            resolve(result)
            Message.to("eval-response", 'response', result)
          })
        }

      })
      // return new Promise(resolve) {
      //
      // }
      // console.log(message)
      // console.log(payload)
    })



    var backgroundPageConnection = chrome.runtime.connect({ name: "devtools-page"});

    backgroundPageConnection.onMessage.addListener(function (message, cb) {
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
        case "eval":
          console.log("EVALLING")
          performEval(message).then(result => {
            console.log(result)
          })
          // window.addEventListener('message', (m) => {
          //
          // });
          // document.getElementById('sandbox').contentWindow.postMessage(message, '*');
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

function performEval(message) {
  return new Promise((resolve) => {
    var result;
    var currentPoll = 0;

    var response = (e) => {
      result = e.data;
    };

    window.addEventListener('message', response);

    document.getElementById('sandbox').contentWindow.postMessage(message, '*');
    // evalIframe.contentWindow.postMessage({value, variables: derivedVariables, dynamicVars}, '*');

    function pollForResponse() {
      if (!result && currentPoll < 5) {
        setTimeout(pollForResponse, 1000)
      } else if (result) {
        window.removeEventListener('message', response);
        resolve(result);
      } else {
        window.removeEventListener('message', response);
        resolve({success: false})
      }
    }

    setTimeout(pollForResponse, 5);
  })
}

export default SnapTest;