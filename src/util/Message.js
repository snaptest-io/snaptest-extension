var devToolConnections = [];

var Message = {

  SESSION: "SESSION",
  POPUP: "POPUP",
  PANEL: "PANEL",
  TAB: "TAB",
  
  NOOP: function() {},

  to: function(destination, action, payload = {}, cb = this.NOOP) {
    if (destination === this.TAB) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: action, payload: payload, destination: destination}, function(response) {
          cb(response);
        });
      });
    } else {
      chrome.runtime.sendMessage({action: action, payload: payload, destination: destination}, function(response) {
          cb(response);
      })
    }
  },

  promise: (action, payload) => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({action, payload: {...payload, type: "PROMISEACTION"}, destination: "SESSION"}, function(response) {
        if (response.success) {
          resolve(response.payload);
        } else {
          reject(response.payload);
        }
      })
    })
  },

  toAll(action, payload = {}, cb = this.NOOP) {
    chrome.runtime.sendMessage({ action: action, payload: payload, destination: "all" }, function(response) {
      cb(response)
    });
    if (typeof chrome.tabs !== "undefined") {
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { action: action, payload: payload, destination: "all" }, function(response) {
            cb(response);
          });
        })
      });
    }
    if (devToolConnections.length > 0) {
      devToolConnections.forEach((devToolConnection) => {
        devToolConnection.postMessage({action: action, payload: payload});
      })
    }
  },

  onMessageFor: function(destination, cb = this.NOOP ) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.destination === destination || request.destination === "all")
        return cb(request, sender, sendResponse);
    });
  },

  addDevToolWindow(devToolConnection) {
    devToolConnections.push(devToolConnection);
  },

  removeDevToolWindow(devToolConnection) {

    var indexOfDevToolConnection = devToolConnections.indexOf(devToolConnection);

    if (indexOfDevToolConnection !== -1) {
      devToolConnections.splice(indexOfDevToolConnection, 1);
    }

  }

};

if (typeof module !== "undefined") {
  module.exports = Message;
}