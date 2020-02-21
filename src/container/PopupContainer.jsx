import React from 'react'
import Message from '../util/Message.js'
import Popup from '../component/Popup/Popup';

class PopupContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.initialState;
  }

  componentWillMount() {
    Message.onMessageFor(Message.POPUP, (message) => {
      switch(message.action) {
        case "stateChange":
          this.setState(message.payload);
          window.isRecording = message.payload.isRecording;
          break;
      }
    })
  }

  render() {
    return <Popup {...this.state} />
  }
}

export default PopupContainer;