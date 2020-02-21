import React from 'react'
import LoginForm from '../../../component/Session/LoginForm'
import Message from '../../../util/Message'

class Onboard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content">
        <div className="onboard grid-row grid-column v-align h-align">
          <div className="login-container grid-row grid-column">
            <h4 className="t-center">SnapTest Cloud Account:</h4>
            <div className="grid-row h-align t-section">
              <LoginForm {...this.props} title="Login" onCancel={() => Message.to(Message.SESSION, "backRoute")}/>
            </div>
            <div className="cloud-features">
              <div className="just-register">Simply register to get started.</div>
              <ul>
                <li>7-day free trial (no credit card required).  $14.99/mo afterwards.</li>
                <li>Auto-saving and syncing across all devices.</li>
                <li>Persistance of results and other test data.</li>
                <li>Simpler code generation via the CLI.</li>
                <li>Cloud execution of tests. (coming soon)</li>
              </ul>
              <div className="grid-row h-align"><a target="_blank" href="https://www.snaptest.io/pricing">Check it out...</a></div>
              <div className="grid-row h-align">
                <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 7c-.12 0-.24.03-.36.04C13.83 4.69 11.62 3 9 3 5.69 3 3 5.69 3 9c0 .05.01.09.01.14C1.28 9.58 0 11.13 0 13c0 2.21 1.79 4 4 4h11c2.76 0 5-2.24 5-5s-2.24-5-5-5z" id="cloud"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}


export default Onboard;
