import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message'

class AccountContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      copyAllToPrivateSuccess: false
    }

  }

  render() {

    const { user, premium, localmode} = this.props;
    const { copyAllToPrivateSuccess } = this.state;

    return (
      <div className="settings-content">
        <div className="settings-title">User Settings</div>
        <div className="account-section">
          <div className="account-header">
            Cloud:
          </div>
          <div className="account-row grid-row v-align">
            <div className="setting-label">
               Email:
            </div>
            <div className="grid-item">
              {user.email}
            </div>
            <a className="btn btn-secondary" onClick={(e) => this.onLogout(e)}>Logout</a>
          </div>
          <div className="account-row grid-row v-align">
            <div className="setting-label">
              API Key:
            </div>
            <div className="grid-item">
              <div className="api-key">
                {user.apikey}
              </div>
            </div>
          </div>
          {(premium && !localmode ) && (
            <div className="account-row grid-row v-align">
              <div className="setting-label">
                {copyAllToPrivateSuccess ? (
                    <div className="form-server-success">Successfully copied data.</div>
                ) : (
                    <a className="btn btn-primary" onClick={(e) => this.onCopyToPrivate() }>Copy account</a>
                )}
              </div>
              <div className="grid-item">
                Copy all tests, components, and profiles to local mode.
              </div>
            </div>
          )}
        </div>
        <div className="account-section">
          <div className="account-header">
            Subscription:
          </div>
          <div className="account-row grid-row v-align">
            <div className="setting-label">
              Current:
            </div>
            <div className="grid-item">
              {premium ? (
                <div>
                  SnapTest Premium
                </div>
              ) : (
                <div>
                  Basic
                </div>
              )}
            </div>
          </div>
        </div>
        {user.role === "adm" && (
          <div className="account-section">
            <div className="account-header">
              Admin:
            </div>
            <div className="account-row grid-row v-align">
              <div className="setting-label">
                Sudo:
              </div>
              <div className="grid-item">
                <input className="text-input full-width" type="text" placeholder="email..." ref="sudoemail"/>
              </div>
              <div className="grid-item">
                <a className="btn btn-secondary" onClick={(e) => this.onSudoLogin()}>Sudo it!</a>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  onSudoLogin() {
    Message.promise("sudoLogin", {email: this.refs.sudoemail.value})
  }

  onCopyToPrivate() {
    if (confirm("This will overwrite your local content.  Continue?")) {
      Message.to(Message.SESSION, "copyAllToPrivate");
      this.setState({copyAllToPrivateSuccess: true})
    }
  }


  componentDidMount() {
    Message.to(Message.SESSION, "updateUserData");
  }

  onLogout(e) {
    if (confirm("Logging out will clear any log data and local tests/data.  Are you sure?")) {
      setTimeout(() => {e.stopPropagation(); e.preventDefault(); Message.to(Message.SESSION, "logout") } , 16);
    };
  }

}

export default AccountContent;
