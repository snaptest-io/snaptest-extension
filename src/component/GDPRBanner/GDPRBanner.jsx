import React from 'react'
import Message from '../../util/Message.js'

class GDPRBanner extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      processing: false
    }
  }

  render() {

    return (
      <div className="GDPRBanner grid-row v-align">
        <div className="grid-item">We have updated our <a href={MARKETING_URL + "/privacy-policy"} target="_blank">privacy policy</a> in accordance with the GDPR.  Please review and accept.</div>
        <div>
          <button className="btn btn-primary" onClick={() => this.onAccept()}>I accept!</button>
        </div>
      </div>
    )
  }

  onAccept() {

    this.setState({processing: true});

    Message.promise("acceptTerms")
      .then(() => this.setState({processing: false}))
      .catch((e) => this.setState({processing: false}))

  }

}

export default GDPRBanner;
