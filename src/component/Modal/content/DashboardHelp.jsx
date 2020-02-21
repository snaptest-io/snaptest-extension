import React from 'react'

class DashboardHelp extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="dashboard-modal iframe-container">
        <iframe src={HELP_URL + "?section=inextensionhelp-dashboard"} />
      </div>
    )
  }

}

export default DashboardHelp;
