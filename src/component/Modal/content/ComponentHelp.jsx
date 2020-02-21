import React from 'react'

class ComponentHelp extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="dashboard-modal iframe-container">
        <iframe src={HELP_URL + "?section=inextensionhelp-component"} />
      </div>
    )
  }

}

export default ComponentHelp;
