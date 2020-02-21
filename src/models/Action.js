import {generate as generateId} from 'shortid'
import _ from 'lodash'
import * as ActionDefs from '../generators/_shared/ActionTruth'

export const BLANK = "BLANK";
export const KEYDOWN = "KEYDOWN";
export const MOUSEDOWN = "MOUSEDOWN";
export const DOUBLECLICK = "DOUBLECLICK";
export const MOUSEOVER = "MOUSEOVER";
export const INPUT = "INPUT";
export const POPSTATE = "POPSTATE";
export const PUSHSTATE = "PUSHSTATE";
export const FULL_PAGELOAD = "FULL_PAGELOAD";
export const CHANGE_WINDOW = "CHANGE_WINDOW";
export const CHANGE_WINDOW_AUTO = "CHANGE_WINDOW_AUTO";
export const PAGELOAD = "PAGELOAD";
export const TEXT_ASSERT = "TEXT_ASSERT";
export const PATH_ASSERT = "PATH_ASSERT";
export const TEXT_REGEX_ASSERT = "TEXT_REGEX_ASSERT";
export const VALUE_ASSERT = "VALUE_ASSERT";
export const STYLE_ASSERT = "STYLE_ASSERT";
export const EVAL_ASSERT = "EVAL_ASSERT";
export const EL_PRESENT_ASSERT = "EL_PRESENT_ASSERT";
export const EL_NOT_PRESENT_ASSERT = "EL_NOT_PRESENT_ASSERT";
export const BACK = "BACK";
export const FORWARD = "FORWARD";
export const REFRESH = "REFRESH";
export const COMPONENT = "COMPONENT";
export const PAUSE = "PAUSE";
export const SCREENSHOT = "SCREENSHOT";
export const URL_CHANGE_INDICATOR = "URL_CHANGE_INDICATOR";
export const FOCUS = "FOCUS";
export const BLUR = "BLUR";
export const SUBMIT = "SUBMIT";
export const SCROLL_WINDOW = "SCROLL_WINDOW";
export const SCROLL_WINDOW_ELEMENT = "SCROLL_WINDOW_ELEMENT";
export const SCROLL_ELEMENT = "SCROLL_ELEMENT";
export const EXECUTE_SCRIPT = "EXECUTE_SCRIPT";
export const META_SCAN = "META_SCAN";
export const CLEAR_COOKIES = "CLEAR_COOKIES";
export const DIALOG = "DIALOG";
export const CLEAR_CACHES = "CLEAR_CACHES";
export const DYNAMIC_VAR = "DYNAMIC_VAR";
export const IF = "IF";
export const ELSEIF = "ELSEIF";
export const ELSE = "ELSE";
export const TRY = "TRY";
export const CATCH = "CATCH";
export const WHILE = "WHILE";
export const DOWHILE = "DOWHILE";
export const FOREACH = "FOREACH";
export const EVAL = "EVAL";
export const CSV_INSERT = "CSV_INSERT";
export const BREAK = "BREAK";
export const REQUEST = "REQUEST";

export const SEL_CSS = "CSS";
export const SEL_XPATH = "XPATH";
export const SEL_ID = "ID";
export const SEL_NAME = "NAME";
export const SEL_ATTR = "ATTR";
export const SEL_TEXT = "TEXT";

export const SELECTOR_TYPES = [
  SEL_CSS, SEL_XPATH, SEL_ID, SEL_NAME, SEL_ATTR, SEL_TEXT
];

export class Action {

  type = null;
  selector = "";
  selectorType = SEL_CSS;
  nodeName = null;
  description = null;
  timeout = null;
  warnings = [];
  suggestions = [];
  continueOnFail = false;
  id = generateId();

  constructor(selector, warnings = [], suggestions = []) {
    if (typeof selector === "string") this.selector = selector;
    if (warnings) this.warnings = warnings;
    if (suggestions) this.suggestions = suggestions;
  }

}

export class KeydownAction extends Action {

  keyValue = "";
  keyCode = "";
  inputValue = "";

  constructor(selector, keyValue, keyCode, inputValue, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = KEYDOWN;
    this.keyValue = keyValue;
    this.keyCode = keyCode;
    this.inputValue = inputValue;
  }

}

export class SubmitAction extends Action {

  constructor(selector, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = SUBMIT;
  }

}

export class MousedownAction extends Action {

  textContent = null;
  textAsserted = false;
  x = null;
  y = null;

  constructor(selector, textContent, x, y, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = MOUSEDOWN;
    if (textContent) this.textContent = textContent;
    if (x) this.x = x;
    if (y) this.y = y;
  }
}

export class DoubleclickAction extends Action {

  type = DOUBLECLICK;

  constructor(selector) {
    super(selector);
    this.type = DOUBLECLICK;
  }

}

export class ClearCachesAction extends Action {

  cookieDomain = "${baseUrl}";
  sessionstorage = true;
  localstorage = true;
  indexdb = true;
  indexdbDatabases = "";
  cookies = true;

  constructor(cookieDomain) {
    super();
    if (cookieDomain) this.cookieDomain = cookieDomain;
    this.type = CLEAR_CACHES;
  }

}


export class DialogAction extends Action {

  alert = true;
  confirm = true;
  prompt = true;
  promptResponse = true;

  constructor(selector) {
    super(selector);
    this.type = DIALOG;
  }

}

export class MouseoverAction extends Action {

  constructor(selector, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = MOUSEOVER;
  }

}

export class FocusAction extends Action {

  constructor(selector, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = FOCUS;
  }

}

export class BlurAction extends Action {

  constructor(selector, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = BLUR;
  }

}

export class InputAction extends Action {

  value = null;
  inputType = null;

  constructor(selector, inputType, value, isContentEditable, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = INPUT;
    this.inputType = inputType;
    if (value) this.value = value;
    this.isContentEditable = isContentEditable;
  }
}

export class ExecuteScriptAction extends Action {

  script = null;
  description = "";

  constructor(script = null, description = "") {
    super();
    this.type = EXECUTE_SCRIPT;
    this.script = script;
    this.description = description;
  }
}

export class ScrollWindow extends Action {

  x = 0;
  y = 0;

  constructor(x = 0, y = 0, warnings, suggestions) {
    super();
    this.type = SCROLL_WINDOW;
    this.x = x;
    this.y = y;
  }
}

export class ScrollWindowToElement extends Action {

  constructor(selector, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = SCROLL_WINDOW_ELEMENT;
  }
}

export class ScrollElement extends Action {

  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    super();
    this.type = SCROLL_ELEMENT;
    this.x = x;
    this.y = y;
  }
}

export class PopstateAction extends Action {

  value = "";
  index = null;

  constructor(value, index) {
    super();
    this.type = POPSTATE;
    if (value) this.value = value;
    this.index = index;
  }

}

export class PushstateAction extends Action {

  value = "";
  index = null;

  constructor(value, index) {
    super();
    this.type = PUSHSTATE;
    if (value) this.value = value;
    this.index = index;
  }
}

export class ChangeWindowAction extends Action {

  value = 0;

  constructor(windowIndex) {
    super();
    this.value = windowIndex;
    this.type = CHANGE_WINDOW;
  }

}

export class AutoChangeWindowAction extends Action {

  value = 0;

  constructor(windowIndex) {
    super();
    this.value = windowIndex;
    this.type = CHANGE_WINDOW_AUTO;
  }

}

export class FullPageloadAction extends Action {

  value = "";
  width = 500;
  height = 500;
  resize = false;
  complete = false;

  constructor(value = "Set url...", width = 500, height = 500) {
    super();
    this.type = FULL_PAGELOAD;
    if (value) this.value = value;
    this.width = width;
    this.height = height;
  }
}

export class PageloadAction extends Action {

  value = "";

  constructor(value) {
    super();
    this.type = PAGELOAD;
    if (value) this.value = value;
  }
}

export class ComponentAction extends Action {

  componentId = null;
  variables = [];

  constructor(componentId) {
    super();
    this.type = COMPONENT;
    if (componentId) this.componentId = componentId;
  }
}

export class UrlChangeIndicatorAction extends Action {

  value = "";
  index = null;

  constructor(value) {
    super();
    if (value) this.value = value;
    this.type = URL_CHANGE_INDICATOR;
  }
}

export class TextAssertAction extends Action {

  value = "";
  regex = false;

  constructor(selector, value, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = TEXT_ASSERT;
    if (value) this.value = value;
  }
}

export class StyleAssertAction extends Action {

  value = "";
  regex = false;
  style = "";

  constructor(selector, value, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = STYLE_ASSERT;
    if (value) this.value = value;
  }
}

// @deprecating
export class TextRegexAssertAction extends Action {

  value = ".+";

  constructor(selector, value, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = TEXT_REGEX_ASSERT;
    if (value) this.value = value;
  }

}

export class ValueAssertAction extends Action {

  value = "";
  regex = false;

  constructor(selector, value, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = VALUE_ASSERT;
    if (value) this.value = value;
  }
}

export class PathAssertAction extends Action {

  value = "";
  regex = false;
  type = PATH_ASSERT;

  constructor(value) {
    super();
    if (value) this.value = value;
  }

}

export class EvalAssertAction extends Action {

  value = "";
  type = EVAL_ASSERT;

  constructor(value) {
    super();
    if (value) this.value = value;
  }

}

export class EvalAction extends Action {

  value = "";
  type = EVAL;

  constructor(value) {
    super();
    if (value) this.value = value;
  }

}
export class DynamicVarAction extends Action {

  value = "";
  type = DYNAMIC_VAR;

  constructor(value) {
    super();
    if (value) this.value = value;
  }

}

export class ElPresentAssertAction extends Action {
  constructor(selector, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = EL_PRESENT_ASSERT;
  }
}

export class ElNotPresentAssertAction extends Action {
  constructor(selector, warnings, suggestions) {
    super(selector, warnings, suggestions);
    this.type = EL_NOT_PRESENT_ASSERT;
  }
}

export class BlankAction extends Action {

  constructor() {
    super();
    this.type = BLANK;
  }

}

export class BackAction extends Action {

  constructor() {
    super();
    this.type = BACK;
  }

}

export class ForwardAction extends Action {

  constructor() {
    super();
    this.type = FORWARD;
  }

}

export class RefreshAction extends Action {

  constructor() {
    super();
    this.type = REFRESH;
  }

}

export class ClearCookiesAction extends Action {

  constructor() {
    super();
    this.value = "${baseUrl}";
    this.type = CLEAR_COOKIES;
  }

}

export class PauseAction extends Action {

  value = 2000;

  constructor(value) {
    super();
    this.type = PAUSE;
    if (value) this.value = value;
  }

}

export class IfAction extends Action {

  constructor() {
    super();
    this.type = IF;
    this.value = new BlankAction();
  }

}

export class IfElseAction extends Action {

  constructor() {
    super();
    this.type = ELSEIF;
    this.value = new BlankAction();
  }

}

export class ElseAction extends Action {

  constructor() {
    super();
    this.type = ELSE;
  }

}

export class ScreenshotAction extends Action {

  value = "filename.png";

  constructor(value) {
    super();
    this.type = SCREENSHOT;
    if (value) this.value = value;
  }

}

export class TryAction extends Action {
  constructor() {
    super();
    this.type = TRY;
  }
}

export class CatchAction extends Action {
  constructor() {
    super();
    this.type = CATCH;
  }
}

export class WhileAction extends Action {
  constructor(selector) {
    super(selector);
    this.type = WHILE;
    this.value = new BlankAction();
    this.maxLoops = 0;
  }
}

export class DoWhileAction extends Action {
  constructor() {
    super();
    this.type = DOWHILE;
    this.value = new BlankAction();
    this.maxLoops = 0;
  }
}

export class ForeachAction extends Action {
  constructor() {
    super();
    this.type = FOREACH;
    this.subType = "ELEMENT";
  }
}

export class CsvInsertAction extends Action {
  constructor() {
    super();
    this.type = CSV_INSERT;
    this.csvName = "my-csv";
    this.columns = [
      {columnName: "colA", selector: ".data", select: "innerHTML"},
      {columnName: "colB", selector: ".data", select: "innerHTML"}
    ];
  }
}

export class BreakAction extends Action {
  constructor() {
    super();
    this.type = BREAK;
  }
}

export class MetaScanAction extends Action {

  pTitle = null;
  pDescription = null;

  constructor() {
    super();
    this.type = META_SCAN;
  }

}

export class RequestAction extends Action {

  reqId = null;
  variables = [];

  constructor(reqId) {
    super();
    this.type = REQUEST;
    this.reqId = reqId;
  }

}

export function generateDescription(state, action) {

  var description = null;
  var customAutoDescription = _.find(state.userSettings.descriptions);

  if (customAutoDescription) {
    description = customAutoDescription.description;
  } else if (ActionDefs.ActionsByConstant[action.type].autodescribe){

    description = ActionDefs.ActionsByConstant[action.type].autodescribe;

    if (action.value) {
      description = description.replace("%value", action.value);
    } else {
      description = description.replace("%value", "VALUE");
    }

    if (action.selector) {
      description = description.replace("%selector", action.selector);
    } else {
      description = description.replace("%selector", "SELECTOR");
    }

    if (action.style) {
      description = description.replace("%style", action.style);
    } else {
      description = description.replace("%style", "STYLE");
    }

    if (action.x) {
      description = description.replace("%x", action.x);
    } else {
      description = description.replace("%x", "XCOORD");
    }

    if (action.y) {
      description = description.replace("%y", action.y);
    } else {
      description = description.replace("%y", "YCOORD");
    }

    if (action.width) {
      description = description.replace("%width", action.width);
    } else {
      description = description.replace("%width", "WIDTH");
    }

    if (action.height) {
      description = description.replace("%height", action.height);
    } else {
      description = description.replace("%height", "HEIGHT");
    }

    if (action.keyValue) {
      description = description.replace("%key", action.keyValue);
    } else {
      description = description.replace("%key", "KEY");
    }

    if (action.nodeName && action.nodeName !== "Unknown") {
      description = description.replace("%type", action.nodeName);
    } else {
      description = description.replace("%type", "EL_TYPE");
    }

  }

  return description;

}