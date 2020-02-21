import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'

class CustomRepeat extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { onClose = _.noop } = this.props;

    return (
      <form className="form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="form-row">
          Repeat <input ref="inputthing" type="number" placeholder="times" onChange={(e) => this.onInputChange(parseInt(e.currentTarget.value))}/>
        </div>
        <div className="form-row">
          <button className="btn btn-primary" onClick={() => onClose() }>OK</button>
        </div>
      </form>
    )
  }

  componentDidMount(){
    this.refs.inputthing.focus();
  }

  onInputChange(value) {
    Message.to(Message.SESSION, "setPlaybackLoopAmount", value === 0 ? null : value);
  }

}

export default CustomRepeat;
