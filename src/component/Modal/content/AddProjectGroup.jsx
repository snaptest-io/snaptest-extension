import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'

class AddProjectGroup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: ""
    }
  }

  render() {

    const { onClose = _.noop } = this.props;
    const { name } = this.state;

    return (
      <form className="form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="grid-row">
          <div className="h-label grid-item grid-row v-align ">New Project Group: </div>
          <div className="h-value grid-item-2">
            <input ref="nameinput"
                   type="text"
                   className="text-input"
                   placeholder={`Project group name...`}
                   value={name}
                   onChange={(e) => this.setState({name: e.currentTarget.value})}/>
          </div>
        </div>
        <div className="grid-row button-group left-aligned">
          <button className="btn btn-primary" onClick={() => this.onCreate() }>Create</button>
          <button className="btn btn-secondary" onClick={() => onClose() }>Cancel</button>
        </div>
      </form>
    )
  }

  componentDidMount(){
    this.refs.nameinput.focus();
  }

  onCreate() {

    const { name } = this.state;

    Message.promise("createProjectGroup", { name }).then(() => Message.promise("getProjectsAndGroups"));
  }

}{}

export default AddProjectGroup;
