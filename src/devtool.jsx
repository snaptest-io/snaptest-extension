import ReactDOM from 'react-dom'
import React from 'react'
import domready from 'domready'
import SnapTest from './container/SnapTest';
require('./scss/base.scss');

domready(function () {
  var uiBodyEl = document.createElement("div");
  uiBodyEl.setAttribute("class", "snpt");
  document.querySelector("body").appendChild(uiBodyEl);
  ReactDOM.render(<SnapTest isDevtool={true} />, uiBodyEl);
});
