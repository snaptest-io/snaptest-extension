import React from 'react';
import _ from 'lodash'
import Message from '../../util/Message'

export default class Highlighter extends React.Component {

  componentDidMount() {
    this.mouseEnterListeners = [];
    this.mouseOutListeners = [];
    this.updateDOM()
  }

  componentDidUpdate(nextProps) {
    // check for changes in props to improve performance!
    this.updateDOM();
  }

  updateDOM() {

    var newInnerHtml = this.mark(this.props.highlight, this.props.text, this.props.markTag,);

    if (this.currentInnerHtml !== newInnerHtml && (_.isString(newInnerHtml) || _.isNumber(newInnerHtml))) {
      this.refs.myel.innerHTML = newInnerHtml;
      this.currentInnerHtml = newInnerHtml;
      setTimeout(() => {
        if (this.refs.myel) this.setupHover(this.refs.myel);
      }, 16)  // gotta give time for the components to render (2 frames)
    }
  }

  mark(_highlighters, opString, markTag = 'mark') {

    if (_highlighters.length === 0) return opString;

    var highlighters = _.uniq(_highlighters);

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

  render() {
    return (
      <span className="TextHighlight" ref="myel"></span>
    );
  }

  setupHover(element) {

    this.tearDownHover();

    // check for mark elements.
    if (element) {

      var marks = element.querySelectorAll("mark");
      this.areListenersSetup = true;

      if (marks.length > 0) {
        for (var i = 0; i < marks.length; i++) {

          marks[i].addEventListener("mouseenter", this.registerNewMouseEnterlistener(marks[i], (e) => {

            e.target.setAttribute("tt-hovered", "");

            setTimeout(() => {

              var stillHovered = e.target.getAttribute("tt-hovered");

              if (stillHovered !== null && !!e.target.parentElement.parentElement) {

                // Find component context, if any.
                var componentActionId = this.getComponentContext(e.target);

                var bbox = e.target.getBoundingClientRect();

                Message.to(Message.SESSION, "openVarTooltip", {
                  componentActionId,
                  x: bbox.left - 126,
                  y: bbox.top + 23,
                  target: e.target.innerHTML.substring(2, e.target.innerHTML.length - 1)
                })
              }

            }, 600);

          }));

          marks[i].addEventListener("mouseout", this.registerNewMouseOutlistener(marks[i], (e) => {
            e.target.removeAttribute("tt-hovered");
            Message.to(Message.SESSION, "closeVarTooltip")
          }));

        }
      }
    }

  }

  getComponentContext(element) {
    var currentElement = element;
    var targetElement = null;

    while (currentElement) {
      if (currentElement.getAttribute("data-id") && currentElement.classList.contains("nw-component")) {
        targetElement = currentElement;
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (targetElement) {
      return targetElement.getAttribute("data-id");
    }

    return null;

  }

  tearDownHover() {
    
    // gotta cleanup baby... otherwise this'll get realllllllyyyyy slow.
    this.mouseEnterListeners.forEach((item) => {
      item.el.removeEventListener("mouseenter", item.cb);
    });

    this.mouseOutListeners.forEach((item) => {
      item.el.removeEventListener("mouseout", item.cb);
    });

  }

  componentWillUnmount() {
    this.tearDownHover();
  }

  registerNewMouseEnterlistener(el, cb) {
    // var listener = _.debounce(cb, 500);
    this.mouseEnterListeners.push({el, cb});
    return cb;
  }

  registerNewMouseOutlistener(el, cb) {
    // var listener = _.debounce(cb, 1);
    this.mouseOutListeners.push({el, cb});
    return cb;
  }

}

Highlighter.propTypes = {
  highlight: React.PropTypes.array.isRequired,
  text: React.PropTypes.string.isRequired,
  markTag: React.PropTypes.string,
};

Highlighter.defaultProps = {
  highlight: null,
  text: null,
  markTag: 'mark',
};