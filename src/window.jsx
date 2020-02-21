import ReactDOM from 'react-dom'
import React from 'react'
import domready from 'domready'
import SnapTest from './container/SnapTest';
import Message from './util/Message';
require('./scss/base.scss');

// load state from session
domready(function () {
  var uiBodyEl = document.createElement("div");
  uiBodyEl.setAttribute("class", "snpt");
  document.querySelector("body").appendChild(uiBodyEl);
  ReactDOM.render(<SnapTest isWindow={true} />, uiBodyEl);
});
