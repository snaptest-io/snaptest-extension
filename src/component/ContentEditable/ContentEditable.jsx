import React, { Component } from 'react';

export default class ContentEditable extends Component {
  constructor (props) {
    super(props);
    this._onChange  = this._onChange.bind(this);
    this._onPaste   = this._onPaste.bind(this);
  }

  _onChange (ev) {
    const method  = this.getInnerMethod();
    const value   = this.refs.element[method];

    this.props.onChange(ev, value);
  }

  _onPaste(ev) {
    const { onPaste, contentEditable } = this.props;

    if (contentEditable === 'plaintext-only') {
      ev.preventDefault();
      var text = ev.clipboardData.getData("text");
      document.execCommand('insertText', false, text);
    }

    if (onPaste) {
      onPaste(this.refs.element.innerText);
    }

  }

  getInnerMethod () {
    return this.props.contentEditable === 'plaintext-only' ? 'innerText' : 'innerHTML';
  }

  shouldComponentUpdate(nextProps, nextState) {
    const method = this.getInnerMethod();
    return nextProps.html !== this.refs.element[method] || this.props.focused !== nextProps.focused;
  }

  render () {

    const { html, contentEditable, focused, variables = [] } = this.props;
    if (!focused && variables.length > 0) var highlightedHtml = this.mark(variables, html);

    return (
      <div
        {...this.props}
        ref="element"
        dangerouslySetInnerHTML={{__html: highlightedHtml || html}}
        contentEditable={ contentEditable === 'false' ? false : true }
        onInput={ this._onChange }
        onFocus={ this.props.onFocus }
        onBlur={ this.props.onBlur }
        onPaste={ this._onPaste } >
      </div>
    )


  }

  mark(highlighters, opString, markTag = 'mark') {

    if (highlighters.length === 0) return opString;

    try {

      var str = opString;

      highlighters.forEach((highlight) => {

        var highlight = highlight || '';
        var escape = highlight.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
        var tagStr = '<{tag}>$&</{tag}>';

        str = str.replace(
          RegExp(escape, 'g'),
          tagStr.replace(/{tag}/gi, markTag)
        );

      });

      var negatives = str.match(/\$\{.+?\}/g);

      if (negatives && negatives.length > 0) {
        negatives = negatives.filter((negative) => highlighters.indexOf(negative) === -1);

        negatives.forEach((negative) => {
          str = str.split(negative).join(`<mark class="neg">${negative}</mark>`);
        });
      }

      return str;

    } catch(e) {
      return opString;
    }

  }

}
