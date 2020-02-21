import React from 'react'
import Message from '../../../util/Message'
import ContentEditable from '../../../component/ContentEditable/ContentEditable';

class DescriptionSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      isEditing: false,
      value: this.props.action.description || ""
    };

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action.description !== this.state.value && !this.state.isEditing) {
      this.setState({value: nextProps.action.description});
    }
  }

  render() {

    const { isFocused, value } = this.state;

    return (
      <div className="description-selector grid-row grid-column">
        <div className="grid-row">
          <ContentEditable
              className="d-content grid-item"
              html={value} // innerHTML of the editable div
              disabled={false}       //
              onFocus={() => this.setState({ isFocused: true, isEditing: true })}
              onBlur={() => this.onBlur() }
              contentEditable="plaintext-only"
              onChange={(e, value) => this.onChange(e.currentTarget.textContent)} // handle innerHTML change
          />
          {!value && (
            <div className="placeholder">add description...</div>
          )}
        </div>
        {(isFocused) && (
          <div className="gen-button">
            <a onMouseDown={() => this.onGen() }>auto-describe</a>
          </div>
        )}
      </div>
    )
  }

  onGen() {

    const { action } = this.props;

    this.setState({isEditing: false}, () => {
      Message.to(Message.SESSION, "genActionDescription", action.id);
    });

  }

  applyNewValue() {
    const { action } = this.props;
    const { value, isEditing } = this.state;

    if (isEditing) {
      action.description = value;
      Message.to(Message.SESSION, "updateNWAction", action);
    }
  }

  onBlur() {
    this.applyNewValue();
    this.setState({ isFocused: false, isEditing: false });
  }

  onChange(newValue) {
    this.setState({value: newValue})
  }

}

export default DescriptionSelector;
