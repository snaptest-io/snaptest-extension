import {getCommonAncestor, checkUnique, getLongestStringInArray, isDescendant} from './util'

export function getSelectorInfo(element, selectorPriority, base = "") {

  if (!selectorPriority) selectorPriority = window.userSettings.selectorPriority;

  var selectorInfo = null;

  for (var i = 0; i < selectorPriority.length; i++) {

    var builder = selectorBuilders[selectorPriority[i].type];

    if (builder && selectorPriority[i].enabled) {

      selectorInfo =
        builder( element, selectorPriority[i], selectorPriority, base);

      if (selectorInfo) {
        return selectorInfo;
      }
    }

  }

  return selectorBuilders["fallback"](element)

}

var selectorBuilders = {

  "id": (element, priority, priorities, base) => {

    var candidate;

    // id
    if (element.id) {
      candidate = "#" + element.id;
      if (checkUnique(base + candidate)) return {
        selector: base + candidate
      }
    };

  },
  "name": (element, priority, priorities, base) => {
    var candidate;

    // name
    if (element.name) {
      candidate = "[name=" + element.name + "]";
      if (checkUnique(base + candidate)) return {
        selector: base + candidate
      };
    };
  },

  "type": (element, priority, priorities, base) => {

    var candidate;

    // type
    if (element.type && !!element.attributes && !!element.attributes[element.type]) {
      candidate = "[type=" + element.type + "]";
      if (checkUnique(base + candidate)) return {
        selector: base + candidate
      }
    };

  },

  "attr": (element, priority, priorities, base) => {

    var candidate;
    var attribute = priority.name;
    var ancestor = priority.ancestor;

    if (ancestor) {
      function findAttributeAncestor(node, attr) {
        var ancestor = node;
        while (ancestor.parentElement) {
          ancestor = ancestor.parentElement;
          if (ancestor.getAttribute(attr)) {
            return ancestor;
          }
        }
      }

      // this is scary...
      var newBase = findAttributeAncestor(element, attribute);

      if (newBase && newBase.getAttribute(attribute)) {

        var attrValue = newBase.getAttribute(attribute);
        var newBaseSelector = `[${attribute}='${attrValue}']`;

        if (checkUnique(base + newBaseSelector)) {

          var rebasedSelector = getSelectorInfo(element, priorities, `${newBaseSelector} `);
          return rebasedSelector;

        }

      }

    }


    if (element.attributes && element.attributes[attribute]) {

      candidate = `[${attribute}='${element.attributes[attribute].value}']`;

      if (checkUnique(base + candidate)) return {
        selector: base + candidate
      }
    };
  },

  "class": (element, priority, priorities, base) => {

    if (typeof element.className !== "string") return;

    // cycle through classes... find if any are unique...
    var classes = element.className.split(' ');

    for (var i = 0; i < classes.length; i++) {
      if (checkUnique(base + "." + classes[i])) {
        return {
          selector: base + "." + classes[i]
        }
      }
    }

  },

  "ancestor": (element, priority, priorities, base) => {

    var bestSelector;

    bestSelector = getBestSelectorForElement(element);

    var matchingElements = document.querySelectorAll(bestSelector);
    if (matchingElements.length < 2) return;

    var commonAncestor = getCommonAncestor(matchingElements);
    var childOfCommonAncestor;
    var indexOfChildOfCommonAncestor;

    for (var i = 0; i < commonAncestor.children.length; i++) {
      var parent = commonAncestor.children[i];
      if (isDescendant(parent, element)) {
        indexOfChildOfCommonAncestor = i;
        childOfCommonAncestor = parent;
      }
    }

    var newSelector = getBestSelectorForElement(commonAncestor) +
      " " + getBestSelectorForElement(childOfCommonAncestor) +
      " " + bestSelector;

    if (checkUnique(base + newSelector)) return {
      selector: base + newSelector
    };

    newSelector =  getBestSelectorForElement(commonAncestor) +
      " > :nth-child(" + (indexOfChildOfCommonAncestor + 1) + ")" +
      " " + bestSelector;

    if (checkUnique(base + newSelector)) return {
      selector: base + newSelector
    };

    else return null;
  },

  "fallback": (el) => {

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

        return {
          selector: goodPath.join(" > "),
          warnings: ["Couldn't find a good selector strategy to target this element. "]
        }

      }

    }

    return {
      selector: path.join(" > "),
      warnings: ["Couldn't find a good selector strategy to target this element. "]
    };
  }

};

function getBestSelectorForElement(element) {

  if (element.classList.length === 0) return element.nodeName.toLowerCase();

  if (element.classList.length === 1) {

    if (element.classList[0].length > 5) {
      return "." + element.classList[0];
    }

    return element.nodeName.toLowerCase();

  }

  if (element.classList.length > 1) {

    var longestClass = getLongestStringInArray(element.classList);

    if (longestClass.length > 1) {
      return "." + longestClass;
    }

    return element.nodeName.toLowerCase();

  }

}

