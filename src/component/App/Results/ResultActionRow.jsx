import React from 'react'
import _ from 'lodash'
import ClassNames from 'classnames'

class ResultActionRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errorSSActive: false,
      ssActive: false,
      ssUrl: null,
      errorssUrl: null
    }
  }

  componentDidMount() {
    this.checkScreenshots()
  }
  
  render() {

    const {result, resultActionRowView = "action", errorScreenshotUrl} = this.props;
    const { errorSSActive, ssActive, ssUrl, errorssUrl } = this.state;
    const error = result.error;
    const condition = result.condition;

    var classes = ClassNames("ResultActionRow", {
      "skipped": result.skipped,
      "success": !error,
      "failed": !!error
    });

    var resultLabel = !error ? String.fromCharCode(10004) : String.fromCharCode(10006);
    var actionText = resultActionRowView === "action" ? result.actionDef : (result.description || `-- No description -- ( ${result.actionDef} )`);

    return (
      <div className={classes} ref="cont">
        {condition ? (
          <div className="grid-row v-align">
            <div className="cute-success-label">{resultLabel}</div>
            <div className="grid-item">{result.conditionT}: {actionText} - (Result: {result.condition})</div>
            <div>{result.duration}ms</div>
          </div>
        ) : (
          <div className="grid-row v-align">
            <div className="cute-success-label">{resultLabel}</div>
            <div className="grid-item">{actionText}
            </div>
            <div>{result.duration}ms</div>
          </div>
        )}
        {( result.ss_url && ssUrl ) && (
          <img onClick={() => this.setState({ssActive: !ssActive})} className={"result-screenshot" + (ssActive ? " active" : "")}  src={ssUrl}/>
        )}

        {!!error && (
          <div className="result-error">
            <div className="text">{result.error}</div>
            {errorScreenshotUrl  && (
              <div>
                <img onClick={() => this.setState({errorSSActive: !errorSSActive})} className={"result-screenshot" + (errorSSActive ? " active" : "")} src={errorssUrl}/>
              </div>
            )}
          </div>
        )}
      </div>
    )

  }

  checkScreenshots() {
    const { result, screenshotCache = [], errorScreenshotUrl, errorScreenshotUuid } = this.props;

    if (result.ss_url) {

      var ssImg = new Image();

      ssImg.onerror = (e) => {

        var cachedScreenshot = _.find(screenshotCache, {uuid: result.ss_uuid});

        if (cachedScreenshot) {
          this.setState({ ssUrl: cachedScreenshot.uri });
        }

      };

      ssImg.src = API_DOMAIN + result.ss_url;
      this.setState({ssUrl: API_DOMAIN + result.ss_url})

    }

    if (errorScreenshotUrl) {

      var errorssImg = new Image();

      errorssImg.onerror = (e) => {

        var cachedScreenshot = _.find(screenshotCache, {uuid: errorScreenshotUuid});

        if (cachedScreenshot) {
          this.setState({ errorssUrl: cachedScreenshot.uri });
        }

      };

      errorssImg.src = API_DOMAIN + errorScreenshotUrl;
      this.setState({errorssUrl: API_DOMAIN + errorScreenshotUrl})

    }
  }

}

export default ResultActionRow;

