import React from 'react'
import FolderRow from './FolderRow'
import Message from '../../../../util/Message'

class Directory extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Message.to(Message.SESSION, "repairDirectory");
  }

  render() {

    const { directory } = this.props;

    return (
      <div className="Directory">
        <FolderRow node={directory.tree} {...this.props}  />
      </div>
    )
  }


}

export default Directory;
