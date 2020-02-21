import React from 'react'
import ViewResult from '../../App/Results/ViewResult'

class ViewResultsModal extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    const { onClose, activeResult } = this.props;

    return (
      <div className="ViewResultModal">
        <div className="modal-header">
          <div className="modal-title">Test Result Output:</div>
          <div className="modal-dismiss"
               onClick={() => onClose() }>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71 0-.55-.45-1-1-1-.28 0-.53.11-.71.29L10 8.59l-4.29-4.3C5.53 4.11 5.28 4 5 4c-.55 0-1 .45-1 1 0 .28.11.53.29.71L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71 0 .55.45 1 1 1 .28 0 .53-.11.71-.29l4.29-4.3 4.29 4.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71L11.41 10z" id="cross_mark_6_"/></svg>
          </div>
        </div>
        <ViewResult {...this.props} result={activeResult} hideClose={true}/>
      </div>
    )
  }

}

export default ViewResultsModal;
