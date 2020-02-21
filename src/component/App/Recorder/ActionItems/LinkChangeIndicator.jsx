import React from 'react'
import Message from '../../../../util/Message'
import {EditableLabel} from '../../../../component'
import QuickActions from '../QuickActions';

class LinkChangeIndicator extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isInComponentAction } = this.props;

    return (
      <div className="grid-item grid-row v-align page-indicator nw-action-con" >
        <div>
          <EditableLabel value={action.value} onChange={(newValue) => this.onValueChange(newValue)}/>
        </div>
        <div className="grid-item"></div>
        <QuickActions action={action}
                      hideMoreInfo
                      hideDuplicate
                      isExpanded={this.props.isExpanded}
                      isSelectingForEl={this.props.selectingForActionId === action.id}
                      isPlayingBack={this.props.isPlayingBack}
                      isInComponent={this.props.isInComponent}
                      isInComponentAction={isInComponentAction}/>
      </div>
    )
  }

  onRemoveRow() {

    const { action } = this.props;

    Message.to(Message.SESSION, "removeNWActions", [action.id])
  }

  onValueChange(newValue) {
    const { action } = this.props;
    action.value = newValue;
    Message.to(Message.SESSION, "updateNWAction", action);
  }

}


export default LinkChangeIndicator;
