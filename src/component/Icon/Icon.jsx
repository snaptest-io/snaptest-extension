import React from 'react'

class Icon extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { name, classNames = ""} = this.props;

    if (name === "remove") {
      return (
        <div className={"icon" + (classNames ? " " + classNames : "")}>
          <img className="icon-remove" src={chrome.extension.getURL("assets/xbutton.png")} />
        </div>
      )
    } else {
      return (
          <div className={"icon icon-" + name}></div>
      )
    }

  }

}

export default Icon;
