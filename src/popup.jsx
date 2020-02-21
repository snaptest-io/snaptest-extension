import domready from 'domready'
import Message from './util/Message'
import ReactDOM from 'react-dom'
import React from 'react'
import PopupContainer from './container/PopupContainer.jsx';

Message.to(Message.SESSION, "getState", {}, function(state) {
  domready(function () {
    ReactDOM.render(<PopupContainer initialState={state} />, document.getElementById("react-app"));
  });
});