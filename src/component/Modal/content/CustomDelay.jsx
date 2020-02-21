import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'

class CustomDelay extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { onClose = _.noop } = this.props;

    return (
      <form className="form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="form-row">
          Delay between actions <input type="number"
                                       ref="inputthing"
                                       placeholder="delay in ms"
                                       onChange={(e) => this.onInputChange(parseInt(e.currentTarget.value))}/>
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
    Message.to(Message.SESSION, "setPlaybackInterval", value === 0 ? null : value);
  }

}

export default CustomDelay;
