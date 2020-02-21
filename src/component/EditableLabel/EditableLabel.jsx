import React from 'react'
import _ from 'lodash'
import {Highlighter }from '../'
import onClickOutsideHOC from 'react-onclickoutside';

class EditableLabel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      newValue: null
    }
  }

  handleClickOutside(e) {
    if (this.state.isEditing) {
      this.onApply();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isEditing && nextProps.setEditing) {
      this.setState({isEditing: true}, () => {
        setTimeout(() => {
          this.refs.editinput.select();
        }, 10);
        nextProps.setEditing();
      });
    }
  }

  render() {

    const { value = "", classNames, noStyles = false, showOKbutton = false, size = "", showEditButton = true, onMouseDown = _.noop, onEnter = _.noop, onClick, doubleClickEdit = true, highlight = null, preLabel = "", postLabel = "", link = false} = this.props;
    const { isEditing, newValue } = this.state;

    return (
      <span className={(noStyles ? "" : "editable-label") + (classNames ? " " + classNames : "")} onMouseDown={onMouseDown} >
        {isEditing ? (
          <span>
            {preLabel}
            <input defaultValue={value}
                   ref="editinput"
                   type="text"
                   autoFocus
                   size={value ? value.length + 2 : 0}
                   onKeyDown={(e) => this.onKeyDown(e)}
                   onChange={(e) => this.setState({newValue: e.currentTarget.value})}/>
            {showOKbutton && (
              <button className="accept" onClick={() => { this.onApply()} }>ok</button>
            )}
            {postLabel}
          </span>
        ) : (
          <span className="value"
                onDoubleClick={(e) => this.onDoubleClick(e) }
                onClick={(e) => _.isFunction(onClick) ? onClick(e) : null }>
            {preLabel}
            { highlight ? (
              <Highlighter text={value} highlight={highlight} />
            ) : link ? (
              <a className={"value-label" + (_.isFunction(onClick) ? " underline" : "")}>{value}</a>
            ) : (
              <span className={"value-label" + (_.isFunction(onClick) ? " underline" : "")}>{value}</span>
            )}
            {postLabel}
            {showEditButton && (
              <button className="edit"
                      onClick={(e) => {onEnter(); e.stopPropagation(); this.setState({isEditing : true, newValue: value})}}>
                <img src={chrome.extension.getURL("assets/edit.png")} />
              </button>
            )}
          </span>
        )}
      </span>
    )
  }

  onDoubleClick(e) {

    const { onEnter = _.noop, doubleClickEdit = true, value} = this.props;

    if (doubleClickEdit) {
      this.setState({isEditing : true, newValue: value});
      onEnter();
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isEditing && this.state.isEditing) {
      this.refs.editinput.select();
    }
  }

  onKeyDown(e) {

    const { onTab = _.noop } = this.props;

    if (e.keyCode === 27) {
      this.setState({
        isEditing: false
      });

      return;
    }

    // ENTER
    if (e.keyCode === 13) {
      this.onApply();
    }
    
    // TAB
    if (e.keyCode === 9) {
      this.onApply();
      onTab(e);
    }

  }

  onApply(e) {
    
    this.setState({ isEditing: false });

    if (this.state.newValue && this.props.value !== this.state.newValue) {
      this.props.onChange(this.state.newValue);  
    }
    
    
  }

}

export default onClickOutsideHOC(EditableLabel);
