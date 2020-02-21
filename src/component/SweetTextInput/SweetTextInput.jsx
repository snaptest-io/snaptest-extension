import React from 'react'
import _ from 'lodash'
import ContentEditable from '../ContentEditable/ContentEditable.jsx'
import {Highlighter } from '../'

class SweetTextInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      isEditing: false,
      value: props.value || "",
      originalValue: props.value || "",
      index: _.isNumber(props.index) ? props.index : null,
      hasTriggeredChange: false,
      hasBeenEdited: false
    };

    this.triggerChange = _.debounce(this.triggerChange.bind(this), props.triggerDebounce || 30);

  }

  componentWillReceiveProps(nextProps) {
    if (
      (_.isNumber(this.state.index) && (this.state.index !== nextProps.index)) ||
      (nextProps.value !== this.state.value && !this.state.isEditing ))
    {
      this.setState({value: nextProps.value, hasBeenEdited: false, hasTriggeredChange: false, originalValue: nextProps.value});
    }
  }

  render() {

    const { isFocused, value } = this.state;
    const { className, placeholder = "", variables = [] } = this.props;
    const html = (!isFocused && value.length === 0) ? placeholder : value;

    return (
      <ContentEditable
        className={className}
        ref="element"
        focused={isFocused}
        variables={variables}
        onKeyDown={(e) => this.onKeyDown(e)}
        onPaste={(newValue) => this.onChange(newValue)}
        html={html}
        onFocus={() => this.setState({ isFocused: true, isEditing: true })}
        onBlur={() => this.onBlur() }
        contentEditable="plaintext-only"
        onChange={(e, value) => this.onChange(e.currentTarget.textContent)} // handle innerHTML change
      />
    )
  }

  applyNewValue() {
    const { onChange = _.noop } = this.props;
    const { value, isEditing } = this.state;
    if (isEditing) onChange(value);
  }

  onKeyDown(e) {
    if(e.key == 'Enter'){
      this.triggerChange();
      this.refs.element.getDOMNode().blur();
    }
    else if(e.key == 'Escape'){
      this.setState({value: this.state.originalValue, hasTriggeredChange: false, hasBeenEdited: false}, () => {
        this.props.onChange(this.state.value);
      });
    }
  }

  onBlur() {

    this.setState({ isFocused: false, isEditing: false });

    if (this.state.hasBeenEdited) {
      this.applyNewValue();
      this.setState({ originalValue: this.state.value });
    }
  }

  onChange(newValue) {

    const { onChange = _.noop, triggerOnFirstEdit = false, triggerEvent } = this.props;
    const { hasTriggeredChange } = this.state;

    if (triggerOnFirstEdit && !hasTriggeredChange) {
      this.setState({value: newValue, hasTriggeredChange: true, hasBeenEdited: true}, () => { onChange(newValue); });
    }
    else if (triggerEvent === "change") {
      this.setState({value: newValue, hasBeenEdited: true}, () => { this.triggerChange(); });
    } else {
      this.setState({value: newValue, hasBeenEdited: true});
    }

  }

  triggerChange() {
    this.setState({originalValue: this.state.value });
    this.props.onChange(this.state.value);
  }

}

export default SweetTextInput;
