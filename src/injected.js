function isDescendant(parent, child) {

  if (parent == child) return true;

  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function blockActions(e) {

  var isInAssertionMode = document.body.className.indexOf("snpa") !== -1;
  var isInSnaptestApp = isDescendant(document.querySelector("#snpt-tab"), e.target);

  if (!isInSnaptestApp && isInAssertionMode) {
    e.stopPropagation();
    e.preventDefault();
  }
}

(function(proxied) {
  window.alert = function() {
    const dialogsEl = document.getElementById('snpt-dialogs');

    if (dialogsEl) {
      const alertValue = dialogsEl.getAttribute('data-alert');

      if (alertValue === "true") return;
    }

    return proxied.apply(this, arguments);
  };
})(window.alert);

(function(proxied) {
  window.confirm = function() {
    const dialogsEl = document.getElementById('snpt-dialogs');

    if (dialogsEl) {
      const confirmValue = dialogsEl.getAttribute('data-confirm');

      if (confirmValue.length > 0) return confirmValue === "true";
    }

    return proxied.apply(this, arguments);
  };
})(window.confirm);

(function(proxied) {
  window.prompt = function() {
    const dialogsEl = document.getElementById('snpt-dialogs');

    if (dialogsEl) {
      const promptValue  = dialogsEl.getAttribute('data-prompt');

      if (promptValue.length > 0) return promptValue;
    }

    return proxied.apply(this, arguments);
  };
})(window.prompt);

window.document.documentElement.addEventListener('click', function(e){
  blockActions(e);
}, true);

window.document.documentElement.addEventListener('submit', function(e){
  blockActions(e);
}, true);

window.document.documentElement.addEventListener('change', function(e){
  blockActions(e);
}, true);

window.document.documentElement.addEventListener('input', function(e){
  blockActions(e);
}, true);
