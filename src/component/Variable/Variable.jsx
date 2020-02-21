import React from 'react'
import _ from 'lodash'
import {EditableLabel, Icon} from '../'

class Variable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openValue: false
    }
  }

  render() {

    const { onNameChange = _.noop, onValueChange = _.noop, onDelete = _.noop, name = "", value = "", system = false, deleteDisabled = false, editDisabled = false } = this.props;
    const { openValue } = this.state;

    return (
      <div className={"Variable variable" + (system ? " system" : "")}>
        <div className="key">
          {"${"}
            {system ? (
              <span>{name}</span>
            ) : (
              <EditableLabel value={name}
                showEditButton={!editDisabled}
                size={name.length}
                onChange={(newValue) => onNameChange(newValue)}
                onTab={() => this.setState({openValue: true})} />
            )}
          {"}"}
        </div>
        <div className="default">
          {system ? (
            <span>{value}</span>
          ) : (
            <EditableLabel value={value}
                           size={value.length}
                           showEditButton={!editDisabled}
                           onChange={(newValue) => onValueChange(newValue)}
                           setEditing={openValue ? () => this.setState({openValue: false}) : null} />
          )}
          {(!system && !deleteDisabled) && (
            <span onClick={() => onDelete()}>
              <Icon classNames="remove-btn" name="remove" />
            </span>
          )}
        </div>
      </div>
    )
  }

}

export default Variable;
