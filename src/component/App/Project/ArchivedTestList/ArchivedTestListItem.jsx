import React from 'react'
import Message from "../../../../util/Message";
import {buildFolderString} from '../../../../util/TestUtils'

class ArchivedTestList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      unarchiving: false
    }

  }

  render() {

    const { test, directory } = this.props;
    const { unarchiving } = this.state;
    const folderPath = buildFolderString(test.prev_fid, directory.tree);
    
    return (
      <div className={`ArchivedTestListItem grid-row ${test.type}`}>
        <div className="square">{test.type}</div>
        <div className="grid-item name">{folderPath.length > 0 && (folderPath + " -> ")}{test.name}</div>
        <div>
          {unarchiving ? (
            <div className="loader"></div>
          ) : (
            <button className="btn btn-secondary" onClick={(e) => this.onUnarchive(e)}>Unarchive</button>
          )}
        </div>

      </div>
    )
  }

  onUnarchive(e) {

    e.preventDefault();

    this.setState({ unarchiving: true });

    Message
      .promise("unarchiveTest", { test: this.props.test })
      .then(() => Message.promise("getArchivedTests"))
      .then(() => this.setState({unarchiving: false}))

  }

}

export default ArchivedTestList;
