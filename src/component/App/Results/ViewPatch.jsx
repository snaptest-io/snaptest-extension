import React from 'react'
import Moment from 'moment'
import Message from "../../../util/Message";
import ResultActionRow from "./ResultActionRow";

class ViewPatch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      loaded: false,
      tests: [],
      csvs: []
    }

  }

  render() {

    const { loaded, tests, csvs, expanded } = this.state;
    const { idx, patch, result } = this.props;

    return (
      <div className="ViewPatch">

        <div className="grid-row v-align patch-header">
          {expanded ? (
            <svg onClick={() => this.onCollapse()} className="svg-icon hoverable expand" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 6c-.28 0-.53.11-.71.29L10 11.59l-5.29-5.3a1.003 1.003 0 0 0-1.42 1.42l6 6c.18.18.43.29.71.29s.53-.11.71-.29l6-6A1.003 1.003 0 0 0 16 6z" id="chevron_down_1_"/></svg>
          ) : (
            <svg onClick={() => this.onExpand()} className="svg-icon hoverable expand" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.71 12.29l-6-6C10.53 6.11 10.28 6 10 6s-.53.11-.71.29l-6 6a1.003 1.003 0 0 0 1.42 1.42L10 8.41l5.29 5.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71z" id="chevron_up_1_"/></svg>
          )}
          <div className="result-ind">
            {patch.tests_passed.length}/{patch.tests.length} Patched Successfully.
          </div>
          <div className="grid-item"></div>
          <div className="">
            {Moment(patch.created).format("MMM D h:mm:ss a")}
          </div>
        </div>
        {expanded && (
          <div>
            {tests.map((testResult) => (
              <div className="test-results">
                <div className="result-row-title grid-row v-align">
                  <div className="square handle">test</div>
                  <div className="result-test-name">{testResult.name}</div>
                  <div className="grid-item"></div>
                  <div className="result-test-duration">{testResult.duration}ms</div>
                </div>
                {testResult.results.map((result, idx) => (
                  <ResultActionRow key={idx}
                                   result={result}
                                   errorScreenshotUrl={testResult.error_ss}
                                   resultView={"action"}
                                   isPendingResult={false} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  loadContent() {
    const { patch, result } = this.props;

    Message.promise("getResultContent", {
      ownerType: result.owner_type,
      ownerId: result.owner_id,
      contentId: patch.content_id,
    }).then((content) => {

      console.log(content.error_ss);

      this.setState({
        loaded: true,
        tests: content.tests,
        csvs: content.csvs
      })
    });

  }

  onExpand() {

    const { content } = this.state;

    this.setState({expanded: true});
    if (!content) this.loadContent();

  }

  onCollapse() {
    this.setState({expanded: false});
  }

}

export default ViewPatch;
