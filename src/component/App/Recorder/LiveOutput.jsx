import React from 'react'
import _ from 'lodash';
import Message from '../../../util/Message'
import {FRAMEWORK_OPTIONS} from '../../../models/frameworkconsts';
import Route from '../../../models/Route'

class LiveOutput extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { generatedCode, selectedFramework, selectedStyle } = this.props;
    const framework = _.find(FRAMEWORK_OPTIONS, {value: selectedFramework});
    var styles = framework ? framework.styles : [];

    return (
      <div className="liveoutput grid-row grid-column">
        <div className="selection-area grid-row v-align">
          <div className="select-wrap">
            <select value={selectedFramework} onChange={(e) => this.onFrameworkChange(e.currentTarget.value)}>
              {FRAMEWORK_OPTIONS.map((framework) => (
                  <option disabled={framework.disabled} value={framework.value}>{framework.name}</option>
              ))}
            </select>
          </div>
          <div className="select-wrap">
            <select value={selectedStyle} onChange={(e) => this.onStyleChange(e.currentTarget.value)}>
              {styles.map((style) => (
                  <option disabled={style.disabled} value={style.value}>{style.name}</option>
              ))}
            </select>
          </div>
          <div className="more-info" onClick={() => this.onMoreInfo() }>
            More info...
          </div>
          <div className="grid-item"></div>
          <div>
            <button className="btn btn-primary" onClick={() => this.onCopyToClipboard() }>Copy to clipboard</button>
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => this.onClose() }>Close</button>
          </div>
        </div>
        <div className="grid-row h-align v-align grid-item">
          <textarea ref="outputcode" spellCheck={false}>{generatedCode}</textarea>
        </div>
      </div>
    )
  }

  onFrameworkChange(framework) {
    Message.to(Message.SESSION, "setFramework", {framework: framework, style: _.find(FRAMEWORK_OPTIONS, {value: framework}).styles[0].value});
  }

  onStyleChange(style) {
    const { selectedFramework } = this.props;

    Message.to(Message.SESSION, "setFramework", {framework: selectedFramework, style: style});
  }

  onMoreInfo() {
    Message.to(Message.SESSION, "generateCode");
    Message.to(Message.SESSION, "pushRoute", new Route("codeviewer" ) );
  }

  onCopyToClipboard() {
    try {
      this.refs.outputcode.select();
      var successful = document.execCommand('copy');
      // this.setState({
      //   errorMessage: null,
      //   successMessage: "JSON successfully Copied to clipboard."
      // })
    } catch (err) {
      // this.setState({
      //   successMessage: null,
      //   errorMessage: "Unable to copy to clipboard: " + err
      // })
    }
  }

  onClose() {
    Message.to(Message.SESSION, "setLiveOutput", false);
  }

}

export default LiveOutput;
