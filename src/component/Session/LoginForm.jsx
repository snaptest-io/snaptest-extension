import React from 'react'
import _ from 'lodash'
import Message from '../../util/Message.js'
import {login, register, forgotPassword} from '../../api'
import Route from '../../models/Route'

const LOGIN_MODE = "LOGIN_MODE";
const REGISTER_MODE = "REGISTER_MODE";
const FORGOT_MODE = "FORGOT_MODE";
const FORGOT_SUCCESS_MODE = "FORGOT_SUCCESS_MODE";

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      processing: false,
      error: null,
      email: "",
      password: "",
      password2: "",
      agreedtoterms: false,
      resettoken: "",
      type: LOGIN_MODE,
      successMessage:  null
    }
  }

  render() {

    const { email, password, password2, processing, error, agreedtoterms, type, successMessage } = this.state;

    if (type===FORGOT_SUCCESS_MODE) {
      return (
        <div>
          <div className="">We've sent you an email to change your password!</div>
          <a onClick={() => this.changeTypeto(LOGIN_MODE)}>Back to login.</a>
        </div>
      )
    }

    return (
      <form className="LoginForm" onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
        <h5 className="form-row form-title">
          { type === LOGIN_MODE ? "Login" :
            type === REGISTER_MODE ? "Register" :
            type === FORGOT_MODE ? "Forgot Password" : "Change password"}
        </h5>
        {(type===LOGIN_MODE || type=== REGISTER_MODE || type === FORGOT_MODE) && (
          <div className="form-row">
            <input type="email" placeholder="email" value={email} onChange={(e) => this.setState({email: e.currentTarget.value}) } autoComplete="off" autoFocus={true} />
          </div>
        )}
        {(type === LOGIN_MODE || type === REGISTER_MODE) && (
          <div className="form-row">
            <input type="password" placeholder="password" value={password} onChange={(e) => this.setState({ password: e.currentTarget.value }) } autoComplete="off" />
          </div>
        )}
        {(type === LOGIN_MODE) && (
          <div className="form-row forgot-my-password">
            <a onClick={() => this.changeTypeto(FORGOT_MODE)}>I forgot my password.</a>
          </div>
        )}
        {(type=== REGISTER_MODE) && (
          <div className="form-row">
            <input type="password" placeholder="password confirm" value={password2} onChange={(e) => this.setState({ password2: e.currentTarget.value }) } autoComplete="off" />
          </div>
        )}
        {( successMessage && type === FORGOT_MODE) && ([
          <div className="form-row">
            <div>{successMessage}</div>
          </div>,
          <div className="form-row">
            <input type="password" placeholder="reset token" value={resettoken} onChange={(e) => this.setState({ resettoken: e.currentTarget.value }) } autoComplete="off" />
          </div>
        ])}
        {(type === REGISTER_MODE && (
          <div className="form-row">
            <label>
              <input id="agreedtoterms" type="checkbox"  value={agreedtoterms} onChange={(e) => this.setState({ agreedtoterms: e.currentTarget.checked }) } />
              I agree to the <a target="_blank" href="https://www.snaptest.io/terms-of-service">Terms of Service</a>.
            </label>
          </div>
        ))}
        <div className="form-row">
          {processing ? (
            <button type="button" className="btn btn-primary btn-disabled">processing...</button>
          ) : (
            <button type="submit" className="btn btn-primary">
              {type === REGISTER_MODE ? "Register" : type === LOGIN_MODE ? "Login" : type === FORGOT_MODE ? "Send reset email" : "Change password"}
            </button>
          )}
        </div>
        {type === LOGIN_MODE && (
          <div className="form-row">
            <a onClick={() => this.changeTypeto(REGISTER_MODE)}>Need an account? Register here.</a>
          </div>
        )}
        {(type === REGISTER_MODE || type === FORGOT_MODE ) && (
          <div className="form-row">
            <a onClick={() => this.changeTypeto(LOGIN_MODE)}>Back to login.</a>
          </div>
        )}
        {error && (
          <div className="form-row">
            <div className="form-server-error">{error}</div>
          </div>
        )}
      </form>
    )
  }

  changeTypeto(type) {
    this.setState({
      type,
      processing: false,
      error: null,
      successMessage:  null
    });
  }

  onSubmit(e) {

    const { email, password, password2, agreedtoterms, type} = this.state;

    e.preventDefault();

    this.setState({ processing: true, error: null });
    
    if (type === LOGIN_MODE) {
      Message
        .promise("login", {email, password})
        .then(() => Message.promise("switchToCloud"))
        .then(() => Message.to(Message.SESSION, "pushRoute", new Route("dashboard")))
        .catch((e) => {
          this.setState({ processing: false, error: _.isString(e.message) ? e.message : e})
        });
    }

    if (type === FORGOT_MODE) {
      forgotPassword(email, MARKETING_URL + "/account/resetpassword")
        .then(() => {
          this.changeTypeto(FORGOT_SUCCESS_MODE);
        })
        .catch((e) => {
          this.setState({ processing: false, error: _.isString(e.message) ? e.message : e })
        });
    }

    if (type === REGISTER_MODE) {
      Message
        .promise("register", {email, password, password2, agreedtoterms })
        .then(() => Message.promise("switchToCloud"))
        .then(() => Message.to(Message.SESSION, "pushRoute", new Route("dashboard")))
        .catch((e) => {
          this.setState({ processing: false, error: _.isString(e.message) ? e.message : e})
        });
    }

  }

}

export default LoginForm;
