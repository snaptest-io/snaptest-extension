import React from 'react'
import Message from '../../../util/Message.js'
var jsonFormat = require('json-format');

class Export extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      successMessage: null,
      errorMessage: null,
      exportData: {}
    }
  }

  componentDidMount() {
    Message.promise("prepExportData").then((data) => {

      var config = {
        type: 'space',
        size: 2
      };

      this.setState({exportData: jsonFormat(data, config)});
      this.refs.exportjson.select();

    })
  }

  render() {

    const { successMessage, errorMessage } = this.state;

    return (

      <div className="import-modal grid-row grid-column">
        <h5>Export</h5>
        <textarea className="grid-item"
                  ref="exportjson"
                  autoFocus={true}>
          {this.state.exportData}
        </textarea>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {errorMessage && (
            <div className="success-message">{errorMessage}</div>
        )}
        <div>
          <button className="btn btn-primary" onClick={() => this.onCopyToClipboard()}>Copy to clipboard</button>
        </div>
      </div>
    )
  }

  onCopyToClipboard() {
    try {
      this.refs.exportjson.select();
      var successful = document.execCommand('copy');
      this.setState({
        errorMessage: null,
        successMessage: "JSON successfully Copied to clipboard."
      })
    } catch (err) {
      this.setState({
        successMessage: null,
        errorMessage: "Unable to copy to clipboard: " + err
      })
    }
  }

}

export default Export;
