import React from 'react'
import Message from "../../../util/Message";
import {StringVariable, SYSTEM_VARS} from "../../../models/Variable";
import {SweetTextInput, Variable} from "../../index";
import _ from 'lodash'

class TestDetailsBody extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { viewTestDescription = false, activeTest, testTags = [], tagIdtoNameMap } = this.props;

    return null;

    return (
      <div className="TestDetailsBody is-open">
        {viewTestDescription && (
          <SweetTextInput value={activeTest.description || ""}
                          onChange={(value) => Message.to(Message.SESSION, "setCurrentTestDescription", value)}
                          className="sweetinput-border test-top-description"
                          placeholder="No description..." />
        )}
      </div>
    )
  }

}

export default TestDetailsBody;
