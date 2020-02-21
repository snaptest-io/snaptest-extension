import React from 'react'
import {Dropdown} from '../../../../../component'
import Message from '../../../../../util/Message'
import MoveTestRow from './MoveTestRow'

class MoveTestDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      success: false,
      error: null
    }
  }

  render() {

    const { user, test, orgAccounts = [] } = this.props;

    return (
      <Dropdown classNames="quick-button-dd test-move-dd" button={
        <button className="quick-button"
                title="Copy/move test to..."
                data-tip="Move/copy test to...">
          <img src={chrome.extension.getURL("assets/move.png")} />
        </button>
      }>
        <div>
          <div className="dd-header">Copy to:</div>
          {user && (
            <MoveTestRow title={user.email} type={"user"} id={"me"} test={test} />
          )}
          {orgAccounts.map((orgAccount) => (
            <MoveTestRow title={orgAccount.name} type={orgAccount.type} id={orgAccount.id} test={test} />
          ))}
        </div>
      </Dropdown>
    )
  }

}

export default MoveTestDropdown;
