import React from 'react'
import _ from 'lodash';

function withSplitPaneInfo(WrappedComponent) {

  return class SplitPaneProvider extends React.Component {

    constructor(props) {
      super(props);
      this.state = { isScreenSplit: false }
    }

    render() {
      return <WrappedComponent isScreenSplit={this.state.isScreenSplit} {...this.props} />;
    }

    componentDidMount() {
      this.debouncedOnResize = _.debounce(this.onResize.bind(this), 16);
      window.addEventListener("resize", this.debouncedOnResize);
      this.onResize();
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.debouncedOnResize);
    }

    onResize() {
      if (window.innerWidth > 850) this.setState({isScreenSplit: true});
      else this.setState({isScreenSplit: false});
    }

  }
}

export default withSplitPaneInfo;
