import React from 'react'

class UploadProgress extends React.Component {

  constructor(props) {
    super(props);

    // this.state = {
    //   hide: props.total === 0
    // }

  }

  componentWillReceiveProps(nextProps) {

    // if (this.props.total === 0 && nextProps.total > 0) {
    //   this.setState({hide: false, full: false});
    // }
    //
    // if (this.props.total > 0 && nextProps.total === 0) {
    //   this.setState({full: true});
    //   setTimeout(() => {
    //     this.setState({hide: true, full: false});
    //   }, 900)
    // }

  }

  render() {

    const { current = 0 } = this.props;
    // const { hide, full = false } = this.state;

    // if (hide) return null;

    return (
      <div className="UploadProgress">
        <div className="total">
          <div className="text">Please wait...</div>
          <div className="actual" style={{width: `${current}%`}}></div>
        </div>
      </div>
    )
  }

}

export default UploadProgress;
