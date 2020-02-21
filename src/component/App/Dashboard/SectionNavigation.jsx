import React from 'react'
import Message from '../../../util/Message'
import Route from '../../../models/Route'

class SectionNavigation extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { section } = this.props;

    return (
      <div className="section-navigation grid-row">
        <div className={"grid-item-3 nav-item" + (section === "tests" ? " active" : "")} onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("dashboard"))}>
          Tests
        </div>
        <div className={"grid-item nav-item disabled" + (section === "runs" ? " active" : "")} onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("runs"))}>
          Runs
        </div>
        <div className={"grid-item nav-item" + (section === "environments" ? " active" : "")} onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("dataprofiles"))}>
          Envs
        </div>
        <div className={"grid-item nav-item disabled" + (section === "results" ? " active" : "")} onClick={() => Message.to(Message.SESSION, "pushRoute", new Route("results"))}>
          Results
        </div>
      </div>
    )
  }

}

export default SectionNavigation;
