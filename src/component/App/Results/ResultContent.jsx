import React from 'react'
import ResultActionRow from "./ResultActionRow";
import Message from "../../../util/Message";

class ResultContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      content: null
    }

  }

  componentDidMount() {
    Message.promise("getResultContent", {contentId: this.props.result.content_id}).then((content) => this.setState({content}));
  }

  render() {

    const { content } = this.state;
    const { result } = this.props;

    return (
      <div className="ResultContent">
        {content ? (
          <div>
            {content.tests.map((test) => (
              <div>
                {result.tests.length > 1 && (<div className="result-row-title">{test.name}</div>)}
                {test.results.map((actionResult, idx) => (
                  <ResultActionRow key={idx} result={actionResult} />
                ))}
              </div>
            ))}
          </div>
          ) : (
          <div><div className="loader"></div></div>
        )}
      </div>
    )
  }

}

export default ResultContent;
