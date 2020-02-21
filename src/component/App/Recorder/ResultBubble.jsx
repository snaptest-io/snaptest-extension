import React from 'react'
import Message from '../../../util/Message'


class ResultBubble extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({visible: true})
    }, 5)
  }

  render() {

    const { visible } = this.state;

    return (
      <div className={"ResultBubble" + (visible ? " visible" : "")} onClick={() => this.onClick()}>
        <div className="alert-bulb">!</div>
        <svg className="list-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 6H1c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1zm0 5H1c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1zm0 5H1c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1zM8 1H1c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm11 0h-7c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1z" id="list:_detail_view"/></svg>
      </div>
    )
  }

  onClick() {
    Message.to(Message.SESSION, "setModal", {name: "view-results" });
  }

}

export default ResultBubble;
