
import {SEL_XPATH, SEL_CSS, SEL_ID, SEL_ATTR, SEL_NAME, SEL_TEXT} from '../models/Action';

export function buildIdentifier(element) {
  return {selector: getElSelector(element)};
}

export function isDescendant(parent, child) {

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

export function getCommonAncestor(nodes) {

  if (nodes.length < 2)
    throw new Error("getCommonAncestor: not enough parameters");

  var i,
      method = "contains" in nodes[0] ? "contains" : "compareDocumentPosition",
      test   = method === "contains" ? 1 : 0x0010,
      node1 = nodes[0];

  rocking:
      while (node1 = node1.parentNode) {
        i = nodes.length;
        while (i--) {
          if ((node1[method](nodes[i]) & test) !== test)
            continue rocking;
        }
        return node1;
      }

  return null;
}

export function getLongestStringInArray(anArrayOfStrings) {

  if (anArrayOfStrings.length < 1) {
    throw new Error("getLongestStringInArray: not enough parameters");
  } else if (anArrayOfStrings.length < 2) {
    return anArrayOfStrings[0];
  }

  var longestEl = anArrayOfStrings[0];

  anArrayOfStrings.forEach(function(el) {
    if (el.length > longestEl.length) longestEl = el;
  })

  return longestEl;

}

export function getElSelector(el) {

  var originalEl = el;

  if (!(el instanceof Element))
    return;
  var path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    var selector = el.nodeName.toLowerCase();
    var sib = el, nth = 1;
    while (sib = sib.previousElementSibling) {
      if (sib.nodeName.toLowerCase() == selector)
        nth++;
    }
    if (nth != 1)
      selector += ":nth-of-type("+nth+")";

    path.unshift(selector);
    el = el.parentNode;
  }

  // trimming process
  for (var i = 0; i < path.length; i++) {

    var goodPath = path.slice(0);

    path.shift();

    if (document.querySelector(path.join(" > ")) !== originalEl) {
      return goodPath.join(" > ");
    }

  }


  return path.join(" > ");
};

export function getElementByXPath(xpath) {

  try {
    const snapshot = document.evaluate(
        xpath,
        document.children[0],
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    return snapshot.snapshotItem(0);
  } catch(e) {
    return null;
  };

};

export function getElement(action) {
  if (action.selectorType === SEL_XPATH) {
    return getElementByXPath(action.selector);
  } else if (action.selectorType === SEL_ID) {
    return safeQuerySelector(`#${action.selector}`);
  } else if (action.selectorType === SEL_ATTR) {
    return safeQuerySelector(`[${action.selector}]`);
  } else if (action.selectorType === SEL_NAME) {
    return safeQuerySelector(`[name="${action.selector}"]`);
  } else if (action.selectorType === SEL_TEXT) {
    return getElementByXPath(`//*[contains(text(), "${action.selector}")]`);
  } else {
    return safeQuerySelector(action.selector);
  }
}

export function checkUnique(selector) {
  try {
    return document.querySelectorAll(selector).length === 1;
  } catch(e) {
    return false;
  }
}

export function getTextNode(element) {

  if (!element) return null;

  var text = "";
  for (var i = 0; i < element.childNodes.length; ++i)
    if (element.childNodes[i].nodeType === 3)
      if (element.childNodes[i].textContent)
        text += element.childNodes[i].textContent;

  text = text.replace(/(\r\n|\n|\r)/gm,"");
  return text.trim();

}

export function getValue(el) {
  if (el.type === 'checkbox' || el.type === 'radio') {
    return el.checked ? "true" : "false";
  } else {
    return el.value;
  }
}

export function getStyle(el, style) {
  return window.getComputedStyle(el, null).getPropertyValue(style);
}

export function safeQuerySelector(selector) {
  try {
    return document.querySelector(selector);
  } catch (e) {
    return null;
  }
}

// refer to https://stackoverflow.com/questions/12168909/blob-from-dataurl
export function dataURItoBlob (dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

export function buildIdToFieldMap(items, key, value) {
  var mapping = {};

  items.forEach((item) => {
    if (typeof value === "function") {
      mapping[item[key]] = value(item)
    } else {
      mapping[item[key]] = item[value]
    }
  });
  return mapping;
}