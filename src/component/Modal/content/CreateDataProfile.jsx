import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'

const DERIVE_FROM = { ALL_TESTS: "ALL_TESTS", ONE_TEST: "ONE_TEST", FOLDER: "FOLDER", NONE: "NONE" , OTHER_PROFILE: "OTHER_PROFILE"};

class CreateDataProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profileName: "",
      derive: DERIVE_FROM.NONE,
      variables: [],
      error: null
    }

  }

  render() {

    const { onClose = _.noop, tests = [], folders = [], profiles = []} = this.props;
    const { derive = DERIVE_FROM.NONE, profileName = "", variables = [], error = null } = this.state;

    return (
      <div className="create-data-profile">
        <form className="form grid-row grid-column" onSubmit={(e) => { e.preventDefault(); }}>
          <div className="title">New Environment:</div>
          <div className="grid-row">
            <div className="h-label grid-item grid-row v-align ">Name: </div>
            <div className="h-value grid-item-2">
              <input ref="profilename"
                     type="text"
                     className="text-input"
                     placeholder={`e.g. "staging" or "prod"`}
                     value={profileName}
                     onChange={(e) => this.setState({profileName: e.currentTarget.value})}/>
            </div>
          </div>
          <div className="grid-row">
            <div className="h-label grid-item grid-row v-align ">Populate using: </div>
            <div className="h-value grid-item-2">
              <div className="select-wrap">
                 <select onChange={(e) => this.onDeriveChange(e) }>
                   <option value={DERIVE_FROM.NONE}>None</option>
                   <option disabled={tests.length === 0} value={DERIVE_FROM.ALL_TESTS}>All tests...</option>
                   <option disabled={tests.length === 0} value={DERIVE_FROM.ONE_TEST}>A test...</option>
                   <option disabled={true || folders.length === 0} value={DERIVE_FROM.FOLDER}>A folder...</option>
                   <option disabled={true || profiles.length === 0} value={DERIVE_FROM.OTHER_PROFILE}>Another profile...</option>
                 </select>
              </div>
            </div>
          </div>
          {derive === DERIVE_FROM.ONE_TEST ? (
            <div className="grid-row">
              <div className="h-label grid-item grid-row v-align ">Test: </div>
              <div className="h-value grid-item-2">
                <div className="select-wrap">
                  <select onChange={(e) => this.generateVariablePreview(e.currentTarget.value)}>
                    {tests.map((test, idx) => (
                      <option idx={idx} value={test.id}>{test.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : derive === DERIVE_FROM.FOLDER ? (
            <div className="grid-row">
              <div className="h-label grid-item grid-row v-align ">Folder: </div>
              <div className="h-value grid-item-2">
                <div className="select-wrap">
                  <select>
                    <option value="bla">a folder</option>
                  </select>
                </div>
              </div>
            </div>
          ) : derive === DERIVE_FROM.OTHER_PROFILE ? (
            <div className="grid-row">
              <div className="h-label grid-item grid-row v-align ">Profile: </div>
              <div className="h-value grid-item-2">
                <div className="select-wrap">
                  <select>
                    <option value="bla">a profile</option>
                  </select>
                </div>
              </div>
            </div>
          ) : null}
          <div className="grid-item">
            {variables.length > 0 && (
              <div className="grid-row">
                <div className="h-label grid-item grid-row v-align ">Will include: </div>
                <div className="h-value grid-item-2 variable-preview">
                  {variables.map((variable, idx) => (
                    <div idx={idx} className="variable"><div className="key">{variable.name}</div></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {error && (
            <div className="grid-row error-message">
              {error}
            </div>
          )}
          <div className="grid-row button-group left-aligned">
            <button className="btn btn-primary" onClick={() => this.onAdd() }>Add</button>
            <button className="btn btn-secondary" onClick={() => onClose() }>Cancel</button>
          </div>
        </form>
      </div>
    )
  }

  componentDidMount(){
    this.refs.profilename.focus();
  }

  generateVariablePreview(id) {

    const { derive } = this.state;
    const { tests, dataProfiles } = this.props;

    if (derive === DERIVE_FROM.NONE) {
      this.setState({variables: []});
    }

    if (derive === DERIVE_FROM.ONE_TEST) {

      var test;

      if (id) {
        test = _.find(tests, {id: id});
      } else {
        test = tests[0];
      }

      this.setState({variables: test.variables});

    }

    if (derive === DERIVE_FROM.ALL_TESTS) {
      var variables = tests.reduce((prev, test) => prev.concat(test.variables), []);
      this.setState({variables: _.uniqBy(variables, "name")});
    }

    if (derive === DERIVE_FROM.OTHER_PROFILE) {
      var variables = tests.reduce((prev, test) => prev.concat(test.variables), []);
      this.setState({variables: _.uniqBy(variables, "name")});
    }

  }

  onDeriveChange(e) {
    this.setState({derive: e.currentTarget.value}, () => {
      this.generateVariablePreview();
    });
  }

  onAdd() {

    const { onClose } = this.props;
    const { variables, profileName } = this.state;

    if (!profileName) {
      this.setState({ error: "Please add a name." });
    } else {
      Message.to(Message.SESSION, "addDataProfile", {name: profileName, variables});
      onClose();
    }
  }

}

export default CreateDataProfile;
