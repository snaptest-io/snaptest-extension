import React from 'react'
import Message from '../../../../util/Message'
import ClassNames from 'classnames'

class MoveEnvRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      success: false,
      error: null
    }

  }

  render() {

    const { type, title } = this.props;
    const { processing, success, error } = this.state;

    const classNames = ClassNames("dd-item", {
      "success": success,
      "error": error,
      "processing": processing
    });

    return (
      <div className={classNames} onClick={(e) => this.onClick(e) }>
        {processing ? (
          <svg className="account-type-svg processing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 1c-.55 0-1 .45-1 1v2.06C16.18 1.61 13.29 0 10 0 4.48 0 0 4.48 0 10c0 .55.45 1 1 1s1-.45 1-1c0-4.42 3.58-8 8-8 2.52 0 4.76 1.18 6.22 3H15c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 8c-.55 0-1 .45-1 1 0 4.42-3.58 8-8 8-2.52 0-4.76-1.18-6.22-3H5c.55 0 1-.45 1-1s-.45-1-1-1H1c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1v-2.06C3.82 18.39 6.71 20 10 20c5.52 0 10-4.48 10-10 0-.55-.45-1-1-1z" id="refresh_1_"/></svg>
        ) : success ? (
          <svg className="account-type-svg success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g id="tick_circle_2_"><path id="Combined-Shape_5_" d="M10 20C4.48 20 0 15.52 0 10S4.48 0 10 0s10 4.48 10 10-4.48 10-10 10zm5-14c-.28 0-.53.11-.71.29L8 12.59l-2.29-2.3C5.53 10.11 5.28 10 5 10c-.55 0-1 .45-1 1 0 .28.11.53.29.71l3 3c.18.18.43.29.71.29.28 0 .53-.11.71-.29l7-7c.18-.18.29-.43.29-.71 0-.55-.45-1-1-1z"/></g></svg>
        ) : error ? (
          <svg className="account-type-svg error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 16H9v-2h2v2zm0-3H9V4h2v9z" id="error_2_"/></svg>
        ) : type === "user" ? (
          <img src={chrome.extension.getURL("assets/cloudmove.png")} />
        ) : (
          <svg className="account-type-svg" viewBox="0 0 20 20"><g id="people_5_"><g id="_x32_0px"><path id="Combined-Shape_17_" d="M16.94 17c-.06-.33-.17-.69-.33-1.06-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15.02-.17.06-.34.11-.5.22-.74.68-1.4 1.29-1.86C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73c.62.46 1.07 1.13 1.29 1.86.05.17.09.33.11.5.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></g></g></svg>
        )}
        {title}
      </div>
    )
  }

  reset() {
    this.setState({
      processing: false,
      success: false,
      error: null
    })
  }

  onClick(e) {

    e.stopPropagation();

    const { profile, type, id } = this.props;

    this.setState({processing: true, success: false, error: null});

    Message.promise("copyEnvToAccount", {envId: profile.id, contextId: id, contextType: type})
      .then(() => {
        this.setState({processing: false, success: true});
      })
      .catch((e) => {
        setTimeout(() => this.reset(), 1000);
        this.setState({processing: false, success: false, error: e})
      })

  }



}

export default MoveEnvRow;
