import _ from 'lodash';

const CATEGORIES = {
  GENERAL : "General",
  MOUSE_KEYBOARD :  "Mouse/Keyboard",
  ASSERTIONS :  "Assertions",
  NAVIGATION :  "Navigation",
  FLOW : "Flow Control",
  WINDOW : "Window & iFrames",
  SCANS : "Scans",
  SCROLL : "Scrolling",
  CACHES : "Cache Clearing"
};

const Actions = [
  {
    "name" : "Load page...",
    "constant" : "FULL_PAGELOAD",
    "category" : CATEGORIES.NAVIGATION,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["navigation", "page", "full", "reload"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "enters '%value' into the browsers url bar",
    "reportResult": true,
    "message": {
      "success": "Page load"
    }
  },
  {
    "name" : "Back",
    "constant" : "BACK",
    "category" : CATEGORIES.NAVIGATION,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["navigation", "page"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "hits \"back\" in the browser",
    "reportResult": true
  },
  {
    "name" : "Forward",
    "constant" : "FORWARD",
    "category" : CATEGORIES.NAVIGATION,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["navigation", "page"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "hits \"forward\" in the browser",
    "reportResult": true
  },
  {
    "name" : "Refresh",
    "constant" : "REFRESH",
    "category" : CATEGORIES.NAVIGATION,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["navigation", "page"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }, {}
    ],
    "autodescribe" : "hits \"refresh\" in the browser",
    "reportResult": true
  },
  {
    "name" : "Select window",
    "constant" : "CHANGE_WINDOW",
    "category" : CATEGORIES.WINDOW,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["window", "tab"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }, {}
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "Enter frame",
    "constant" : "ENTER_FRAME",
    "category" : CATEGORIES.WINDOW,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["enter", "change", "select", "frame", "iframe", "push"],
    "params" :[
      {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "Exit frame",
    "constant" : "EXIT_FRAME",
    "category" : CATEGORIES.WINDOW,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["frame", "iframe", "exit", "pop", "back"],
    "params" :[],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "Click element",
    "constant" : "MOUSEDOWN",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["mousedown", "mouseup"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }, {}
    ],
    "autodescribe" : "clicks on the \"ELEMENT\" element",
    "reportResult": true
  },
  {
    "name" : "Double-click el",
    "constant" : "DOUBLECLICK",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["doubleclick", "mouse"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "double-clicks on the \"ELEMENT\" element",
    "reportResult": true
  },
  {
    "name" : "Press key...",
    "constant" : "KEYDOWN",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "enters the \"%key\" when focused on the \"ELEMENT\" element",
    "reportResult": true
  },
  {
    "name" : "Change input",
    "constant" : "INPUT",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["input", "select", "text", "value", "form", "insert", "add", "type", "write", "keydown", "keyup", "press"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "changes the \"ELEMENT\" element to \"%value\"",
    "reportResult": true
  },
  {
    "name" : "Submit form",
    "constant" : "SUBMIT",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["form"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "submits the \"FORM\" form",
    "reportResult": true
  },
  {
    "name" : "Mouse over",
    "constant" : "MOUSEOVER",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["hover"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "mouses over the \"ELEMENT\" element",
    "reportResult": true
  },
  {
    "name" : "Focus",
    "constant" : "FOCUS",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["blur"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "focuses on the \"ELEMENT\" element",
    "reportResult": true
  },
  {
    "name" : "Blur",
    "constant" : "BLUR",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["focus"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "blurs away from the \"ELEMENT\" element",
    "reportResult": true
  },
  {
    "name" : "Eval",
    "constant" : "EVAL",
    "category" : CATEGORIES.GENERAL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["execute", "script", "eval"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "pauses for %value ms",
    "reportResult": true
  },
  {
    "name" : "Pause",
    "constant" : "PAUSE",
    "category" : CATEGORIES.GENERAL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["wait", "stop", "sleep", "delay"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "pauses for %value ms",
    "reportResult": true
  },
  {
    "name" : "Execute script",
    "constant" : "EXECUTE_SCRIPT",
    "category" : CATEGORIES.GENERAL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["evaluate"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "Clear cookies",
    "constant" : "CLEAR_COOKIES",
    "category" : CATEGORIES.CACHES,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["cache", "logout"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "clears cookies for the \"%value\" domain",
    "reportResult": true
  },
  {
    "name" : "Clear caches",
    "constant" : "CLEAR_CACHES",
    "category" : CATEGORIES.CACHES,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["cookies", "logout", "localstorage", "sessionstorage", "indexdb"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "clears caches",
    "reportResult": true
  },
  {
    "name" : "Set page dialogs",
    "constant" : "DIALOG",
    "category" : CATEGORIES.GENERAL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["confirm", "alert", "prompt"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "sets dialogs for this page",
    "reportResult": true
  },
  {
    "name" : "Add dynamic var",
    "constant" : "DYNAMIC_VAR",
    "category" : CATEGORIES.GENERAL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["variables"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "Drag-n-drop",
    "constant" : "",
    "category" : CATEGORIES.MOUSE_KEYBOARD,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "disabled" :true,
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "El is present",
    "constant" : "EL_PRESENT_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["exists", "visible", "element", "wait", "for", "present"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "verifies that the \"ELEMENT\" element is present",
    "reportResult": true
  },
  {
    "name" : "El isn't present",
    "constant" : "EL_NOT_PRESENT_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["exists", "visible", "element",  "wait", "for", "present"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "verifies that the \"ELEMENT\" element isn't present",
    "reportResult": true
  },
  {
    "name" : "El is visible",
    "constant" : "EL_VISIBLE_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["exists", "visible", "element", "wait", "for", "present"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "verifies that the \"ELEMENT\" element is visible",
    "reportResult": true
  },
  {
    "name" : "El isn't visible",
    "constant" : "EL_NOT_VISIBLE_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["exists", "visible", "element",  "wait", "for", "present"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "verifies that the \"ELEMENT\" element isn't visible",
    "reportResult": true
  },
  {
    "name" : "El text is...",
    "constant" : "TEXT_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["exists", "visible"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "verifies that the \"ELEMENT\" element's text is \"%value\"",
    "reportResult": true
  },
  {
    "name" : "Input value is...",
    "constant" : "VALUE_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["form", "value", "input", "wait", "for", "present"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "verifies that the \"ELEMENT\" input is \"%value\"",
    "reportResult": true
  },
  {
    "name" : "Path is...",
    "constant" : "PATH_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["url", "wait", "for", "present"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "verifies that the url's path is \"%value\"",
    "reportResult": true
  },
  {
    "name" : "Style...",
    "constant" : "STYLE_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "verifies that the \"ELEMENT\" element's \"%style\" attribute is \"%value\"",
    "reportResult": true
  },
  {
    "name" : "El text regex...",
    "constant" : "TEXT_REGEX_ASSERT",
    "category" : CATEGORIES.ASSERTIONS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "url indicator",
    "constant" : "URL_CHANGE_INDICATOR",
    "category" : CATEGORIES.GENERAL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": false
  },
  {
    "name" : "Screenshot",
    "constant" : "SCREENSHOT",
    "category" : CATEGORIES.GENERAL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["take", "picture", "snapshot"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "takes a screenshot and saves it to %value",
    "reportResult": true
  },
  {
    "name" : "Scroll win to...",
    "constant" : "SCROLL_WINDOW",
    "category" : CATEGORIES.SCROLL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["scroll", "find"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "scrolls the window to %x and %y coordinates",
    "reportResult": true
  },
  {
    "name" : "Scroll win to el",
    "constant" : "SCROLL_WINDOW_ELEMENT",
    "category" : CATEGORIES.SCROLL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["scroll", "find"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "scrolls the window to the \"ELEMENT\" element",
    "reportResult": true
  },
  {
    "name" : "Scroll el to...",
    "constant" : "SCROLL_ELEMENT",
    "category" : CATEGORIES.SCROLL,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["scroll", "find"],
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "scrolls the \"ELEMENT\" element to %x and %y coordinates",
    "reportResult": true
  },
  {
    "name" : "SEO meta scan",
    "constant" : "META_SCAN",
    "category" : CATEGORIES.SCANS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["meta"],
    "disabled" :true,
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "Placeholder scan",
    "constant" : "PLACEHOLDER_SCANS",
    "category" : CATEGORIES.SCANS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["meta"],
    "disabled" :true,
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name" : "Spelling scan",
    "constant" : "SPELLING_SCANS",
    "category" : CATEGORIES.SCANS,
    "description" :null,
    "supportedBy" :[
      "snaptest",
      "nightwatch"
    ],
    "tags": ["meta"],
    "disabled" :true,
    "params" :[
      {
        "name" : "selector",
        "description" : "Element to be clicked"
      }, {
        "name" : "value",
        "description" : "none"
      }
    ],
    "autodescribe" : "none",
    "reportResult": true
  },
  {
    "name": "Try",
    "constant": "TRY",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": ["flow", "error", "catch"],
    "params": [],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "Catch",
    "constant": "CATCH",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": ["flow", "error", "try"],
    "params": [],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "If...",
    "constant": "IF",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params": [
      {
        "name": "selector",
        "description": "Element to be clicked"
      }, {
        "name": "value",
        "description": "none"
      }
    ],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "Else if...",
    "constant": "ELSEIF",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params": [
      {
        "name": "selector",
        "description": "Element to be clicked"
      }, {
        "name": "value",
        "description": "none"
      }
    ],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "Else...",
    "constant": "ELSE",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params": [
      {
        "name": "selector",
        "description": "Element to be clicked"
      }, {
        "name": "value",
        "description": "none"
      }
    ],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "While",
    "constant": "WHILE",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": ["loop", "repeat"],
    "params": [
      {
        "name": "selector",
        "description": "Element to be clicked"
      }, {
        "name": "value",
        "description": "none"
      }
    ],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "Do... while",
    "constant": "DOWHILE",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": ["loop", "repeat"],
    "params": [
      {
        "name": "selector",
        "description": "Element to be clicked"
      }, {
        "name": "value",
        "description": "none"
      }
    ],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "Break",
    "constant": "BREAK",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params": [
      {
        "name": "selector",
        "description": "Element to be clicked"
      }, {
        "name": "value",
        "description": "none"
      }
    ],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "Insert CSV row",
    "constant": "CSV_INSERT",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params": [
      {
        "name": "selector",
        "description": "Element to be clicked"
      }, {
        "name": "value",
        "description": "none"
      }
    ],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "For Each...",
    "constant": "FOREACH",
    "category": CATEGORIES.FLOW,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "disabled": true,
    "params": [
      {
        "name": "selector",
        "description": "Element to be clicked"
      }, {
        "name": "value",
        "description": "none"
      }
    ],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "Select Action...",
    "constant": "BLANK",
    "category": null,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params": [],
    "autodescribe": "none",
    "reportResult": false
  },
  {
    "name": "",
    "constant": "COMPONENT",
    "category": null,
    "description": null,
    "supportedBy": [
      "snaptest",
      "nightwatch"
    ],
    "tags": [],
    "params": [],
    "autodescribe": "none",
    "reportResult": false
  }
];

/*
Build a map with constants as key for speed purposes:
 */

var _actionsByConstant = {};

Actions.forEach((action) => {
  _actionsByConstant[action.constant] = action;
});

const ActionsByConstant = _actionsByConstant;


/*
Build lists grouped under categories
 */

var _actionsByCategory = [];
var _actionsByCategoryMap = {};


for (var i in CATEGORIES) {
  var category = CATEGORIES[i];
  _actionsByCategory.push({
    label: category,
    actions: []
  });
  _actionsByCategoryMap[category] = {actions: []};
}

Actions.forEach((action) => {
  if (!action.category) return;

  var category = _.find(_actionsByCategory, {label: action.category});
  category.actions.push(action);

  var categoryMap = _actionsByCategoryMap[action.category];
  categoryMap.actions.push(action);
});


const ActionsByCategory = _actionsByCategory;
const ActionsByCategoryMap = _actionsByCategoryMap;


/*
Export them all!
 */
export { ActionsByConstant, ActionsByCategory, ActionsByCategoryMap, Actions };