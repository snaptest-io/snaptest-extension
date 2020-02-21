import React from 'react'
import _ from 'lodash';
import DashboardHeader from '../App/Dashboard/DashboardHeader.jsx';
import DashboardContent from '../App/Dashboard/DashboardContent.jsx';
import SaveWarning from '../App/Onboard/SaveWarning.jsx';

class SplitPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = {showDirectory: false, dragging: false, resizerX: 0, previousWidth: 380, width: 380}
  }

  render() {

    const { section } = this.props;
    const { showDirectory, width } = this.state;

    return showDirectory ? (
      <div className="grid-row grid-column full-height double-pane">
        <DashboardHeader {...this.props} showAccounts showSettings showAutoSaveStatus showMenu globalHeader section={section} isMultiPane />
        <div className="split-content grid-row grid-item">
          <div className="left-pane" style={{"width": width}}>
            {this.props.leftPane ? this.props.leftPane : (
              <DashboardContent {...this.props} positionCreateButtonsTop showSelectedTest />
            )}
            <div className="pane-resizer"
                 ref="resizer"
                 onMouseDown={(e) => this.onMouseDown(e)}>
            </div>
          </div>
          <div className="grid-item right-pane">
            {this.props.rightPane ? this.props.rightPane : (
              <div className="content">
                Nothing...
              </div>
            )}
          </div>
        </div>
        <SaveWarning {...this.props} />
      </div>
    ) : (
      <div className="grid-row grid-column full-height single-pane">
        {this.props.singlePane}
        <SaveWarning {...this.props} />
      </div>
    );

  }

  componentDidMount() {
    this.debouncedOnResize = _.debounce(this.onResize.bind(this), 16);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    window.addEventListener("resize", this.debouncedOnResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedOnResize);
  }

  onResize() {
    if (window.innerWidth > 850) this.setState({showDirectory: true});
    else this.setState({showDirectory: false});
  }

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseDown(e) {

    e.stopPropagation();
    e.preventDefault();

    // only left mouse button
    if (e.button !== 0) return;

    this.setState({
      dragging: true,
      mouseDownX: e.pageX,
    });
  }

  onMouseUp(e) {
    this.setState({dragging: false, previousWidth: this.state.width});
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseMove(e) {
    if (!this.state.dragging) return;

    var newWidth = this.state.previousWidth + (e.pageX - this.state.mouseDownX);

    if (newWidth < 350) newWidth = 350;

    this.setState({ width: newWidth});
    e.stopPropagation();
    e.preventDefault();
  }

}

export default SplitPane;
