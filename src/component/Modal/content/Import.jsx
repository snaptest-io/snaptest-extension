import React from 'react'
import Message from '../../../util/Message.js'

class Import extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: null
    }

  }

  render() {

    const { message } = this.state;

    return (
      <div className="import-modal grid-row grid-column">
        <h5>Import</h5>
        <textarea className="grid-item"
                  ref="importjson"
                  autoFocus={true}
                  onKeyDown={(e) => {if (e.keyCode === 13) this.onImport() }}
                  placeholder="Copy test JSON here..."></textarea>
        {message && (
          <div className="error-message">{message}</div>
        )}
        <div>
          <button className="btn btn-primary" onClick={() => this.onImport()}>Import</button>
        </div>
      </div>
    )
  }

  componentDidMount(){
    this.refs.importjson.focus();
  }

  onImport() {

    const { closeModal } = this.props;

    var importedData = {};

    try {
      importedData = JSON.parse(this.refs.importjson.value);
    } catch (e) {
      this.setState({
        message: e.message
      });
    }

    if (importedData.tests && importedData.components && importedData.directory) {
      Message.promise("importData", {data: importedData});
      closeModal();
    }

  }

}

export default Import;
