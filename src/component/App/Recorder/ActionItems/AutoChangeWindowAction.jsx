import React from 'react'
import Message from '../../../../util/Message'
import QuickActions from '../QuickActions';

class AutoChangeWindowAction extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

    const { action, isInComponentAction } = this.props;

    return (
      <div className="grid-item grid-row nw-action-con grid-column">
        <div className="action-info">
          <div className="action-type">
            (auto) Focus on window:
          </div>
          <div className="grid-item">
            #{action.value}
          </div>
          <QuickActions {...this.props}
                        isHovered={this.state.isHovered}
                        isSelectingForEl={this.props.selectingForActionId === action.id} />
        </div>
      </div>
    )
  }

}


export default AutoChangeWindowAction;
