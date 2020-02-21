import React from 'react'
import Message from '../../util/Message.js'
import {loadItems} from '../../util/statePersistance';

class BetaAccessForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isProcessing: false,
      serverError: null,
      successMessage: null
    }

  }

  render() {

    const { email, isProcessing, serverError, successMessage} = this.state;
    const { title = null } = this.props;

    return (
      <form className="beta-access-form" onSubmit={(e) => this.onSubmit(e)}>
        {title && (
          <h5 className="form-row form-title">{title}</h5>
        )}
        <div className="form-row">
          <input type="email" placeholder="email" value={email} onChange={(e) => this.setState({email: e.currentTarget.value}) } />
        </div>
        <div className="form-row">
          {isProcessing ? (
            <button type="button" className="btn btn-primary">sending...</button>
          ) : (
            <button type="submit" className="btn btn-primary">Request access</button>
          )}
        </div>
        {serverError && (
          <div className="form-row">
            <div className="form-server-error">{serverError}</div>
          </div>
        )}
        {successMessage && (
            <div className="form-row">
              <div className="form-server-success">{successMessage }</div>
            </div>
        )}
      </form>
    )
  }

  onSubmit(e) {

    this.setState({serverError: null, isProcessing: true});
    var _this = this;

    e.preventDefault();

    var body = {email: this.state.email, target: "betaaccessextension"};

    fetch(API_URL + '/emailsignup', {
      method: "POST",
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify(body)
    }).then((response) => {
      _this.setState({successMessage: "Request submitted.  You'll receive an email shortly with login details.", serverError: null, isProcessing: false})
    }).catch((error) => {
      _this.setState({serverError: error, isProcessing: false})
    });

  }

}

export default BetaAccessForm;
