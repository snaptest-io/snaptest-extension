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
