import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'

class ArchiveProject extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { onClose = _.noop } = this.props;

    return (
      <form className="form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="form-row">
          Are you sure???
        </div>
        <div className="form-row">
          <button className="btn btn-primary" onClick={() => onClose() }>Archive</button>
          <button className="btn btn-secondary" onClick={() => onClose() }>Cancel</button>
        </div>
      </form>
    )
  }

  onArchive() {

  }

}

export default ArchiveProject;
