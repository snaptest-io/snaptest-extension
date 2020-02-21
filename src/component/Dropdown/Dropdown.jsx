import React from 'react'
import _ from 'lodash'
import onClickOutsideHOC from 'react-onclickoutside'
import ClassNames from 'classnames'

class DropDown extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      containerTop: 0
    }
  }

  handleClickOutside() {

    const { onClose = _.noop } = this.props;

    onClose();

    this.setState({
      isOpen: false
    })
  }

  componentWillMount() {

    this.onBodyKeyDown = function(e) {
      if (e.keyCode === 27) {
        this.setState({
          isOpen: false
        });
      }
    }.bind(this);

    document.addEventListener("keydown", this.onBodyKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onBodyKeyDown);
  }

  openMenu() {
    const { onOpen = _.noop } = this.props;
    if (!this.state.isOpen) onOpen();
    this.setState({ isOpen: !this.state.isOpen});
  }

  render() {

    const { button, classNames = "", onClick = _.noop} = this.props;
    const { isOpen } = this.state;

    return (
      <div className={"dropdown" + (classNames ? " " + classNames : "")} ref="dropdownbutton">
        <div className={"dropdown-trigger " + (this.state.isOpen ? " active" : "")}
             onMouseDown={() => this.openMenu() }
             onClick={(e) => onClick(e)}>
          {button}
        </div>
        {isOpen && (
            <div className={`dropdown-container` + (this.state.isOpen ? " active" : "")}
                 onClick={() => (this.handleClickOutside())} >{this.props.children}</div>
        )}
      </div>
    )
  }
}

export default onClickOutsideHOC(DropDown);
