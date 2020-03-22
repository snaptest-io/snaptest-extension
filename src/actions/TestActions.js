import _ from 'lodash'
import {generate as generateId} from 'shortid'
import deepClone from 'deep-clone'
import {autoSave, loadItems, repairDirectory, saveInBatches} from '../util/statePersistance';
import { findNodeById, findNode, removeNodeFromTree, walkThroughTreeNodes } from '../util/treeUtils';
import * as LocalActions from './LocalActions';
import * as TagActions from './TagActions';
import * as API from "../api";

export const getTestData = (params, state) => {

  if (state.localmode) return;

  return loadItems(state.user.apikey, state.contextType, state.contextId)
    .then((result) => {
      state.tests = result.tests;
      state.components = result.components;
      state.dataProfiles = result.dataProfiles;
      state.directory = result.directory;
      state.testsInTagsMap = TagActions.createTestsInTagsMap(result.testsInTags);
    })
    .then(() => repairDirectory(state))
    .catch((e) => {
      if (e.status === 401) state.projectReadAccessDenied = true;
    })

};

export const getArchivedTests = (params, state) => {

  if (state.localmode) return;

  return API.getArchivedTests(state.user.apikey, state.contextType, state.contextId)
    .then((result) => {
      state.archivedTests = result.tests.items;
    })
    .catch((e) => {
      if (e.status === 401) state.projectReadAccessDenied = true;
    })

};

export const unarchiveTest = (params, state) => {

  if (state.localmode) return;

  const { test } = params;

  return API.unarchiveTest(state.user.apikey, state.contextType, state.contextId, test.id)
    .then((result) => {

      if (test.prev_fid) {
        var destNode = findNode(state.directory.tree, {id: test.prev_fid});

        if (destNode && destNode.children) {
          destNode.children.push({
            module: test.name,
            testId: test.testId,
            leaf: true,
            id: generateId(),
            type: test.type
          });
        }

        test.id = test.testId;
        state.tests.push(test);

        autoSave({type: "directory", directory : state.directory}, state, state.localmode ? false : true);

      }
    })
    .catch((e) => {
      if (e.status === 401) state.projectReadAccessDenied = true;
    })

};

export const getTestsInTags = (params, state) => {

  const { contextType, contextId } = state;

  if (state.localmode) return;

  return API.getTestsInTags(state.user.apikey, contextType, contextId)
    .then((result) => {
      state.testsInTagsMap = TagActions.createTestsInTagsMap(result.testsInTags.items);
    });
};

export const generateExamples = (params, state) => {

  if (!state.localmode) return; // only generate examples in local mode.

  var tests = [
    {
      "id": "Hkldgv6VQ",
      "name": "Try Catch test",
      "actions": [
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJvMGaSMX",
          "value": "${baseUrl}/account/login",
          "width": 1331,
          "height": 671,
          "resize": false
        },
        {
          "type": "TRY",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HkbXGpBMX"
        },
        {
          "type": "MOUSEDOWN",
          "selector": "form > :nth-child(1) .label-text",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Skl18aSz7",
          "textContent": null,
          "textAsserted": false,
          "x": null,
          "y": null,
          "indent": 1
        },
        {
          "type": "TRY",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1GhD6BM7",
          "indent": 1
        },
        {
          "type": "MOUSEDOWN",
          "selector": "form > :nth-child(1) .label-textt",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": 200,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rkJJIprMX",
          "textContent": null,
          "textAsserted": false,
          "x": null,
          "y": null,
          "indent": 2
        },
        {
          "type": "MOUSEDOWN",
          "selector": "form > :nth-child(1) .label-textt",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": 200,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Hk3ZEaHzQ",
          "textContent": null,
          "textAsserted": false,
          "x": null,
          "y": null,
          "indent": 2
        },
        {
          "type": "CATCH",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SkVbVTSGQ",
          "indent": 0
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".f1",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S1eHyUTSGQ",
          "textContent": null,
          "textAsserted": false,
          "x": null,
          "y": null,
          "indent": 1
        }
      ],
      "variables": [
        {
          "id": "HJgwMMaBfm",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "BJxgdxDTVX",
      "name": "Eval actions",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r1eIuYXmGm",
          "value": "/test-playground/forms",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ByIdKXQfm",
          "value": "${baseUrl}/test-playground/forms",
          "isInitialLoad": false,
          "width": 1031,
          "height": 720
        },
        {
          "type": "EVAL",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r15YtXXz7",
          "value": "true",
          "indent": 0
        },
        {
          "type": "EVAL",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJdntmQMQ",
          "value": "vars.baseUrl.indexOf(\"http\") !== -1",
          "indent": 0
        },
        {
          "type": "EVAL",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": 1000,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": true,
          "id": "HyKuKXmG7",
          "value": "false",
          "indent": 0
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SyOXoXmz7",
          "value": "$(vars.baseUrl + \"/test-playground/dialogs\")",
          "isInitialLoad": false,
          "width": 500,
          "height": 500
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1UNjXXzQ",
          "value": "/test-playground/dialogs/",
          "regex": false
        },
        {
          "type": "EVAL",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ByveoX7MQ",
          "value": "vars.nextPath=\"/test-playground/caches\"; true;"
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SJZ0YQQz7",
          "value": "$(vars.baseUrl + vars.nextPath)",
          "isInitialLoad": false,
          "width": 500,
          "height": 500
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ryye5QXMQ",
          "value": "/test-playground/caches/",
          "regex": false
        }
      ],
      "variables": [
        {
          "id": "r1x8o-ZzM7",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "Sy-gdgw6Nm",
      "name": "Advanced Selectors",
      "actions": [
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S1INNU5y7",
          "value": "${baseUrl}/test-playground/miscellaneous",
          "isInitialLoad": false,
          "width": 500,
          "height": 500
        },
        {
          "type": "INPUT",
          "selector": "name-selector",
          "selectorType": "NAME",
          "nodeName": null,
          "description": null,
          "timeout": 1000,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rk9gELq17",
          "value": "selected"
        },
        {
          "type": "INPUT",
          "selector": "id-selector",
          "selectorType": "ID",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJFHSU5JX",
          "value": "selected"
        },
        {
          "type": "INPUT",
          "selector": "//*[contains(@id, 'xpath-selector')]",
          "selectorType": "XPATH",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ry5rSLqkm",
          "value": "selected"
        }
      ],
      "variables": [
        {
          "id": "SJqSN8qJm",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "rkfxOxPTEX",
      "name": "Dialogs",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r1bNvY-51X",
          "value": "/test-playground/dialogs",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ry4PYbqym",
          "value": "${baseUrl}/test-playground/dialogs",
          "isInitialLoad": false,
          "width": 871,
          "height": 716
        },
        {
          "type": "DIALOG",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rkwPYbcym",
          "alert": true,
          "confirm": true,
          "prompt": true,
          "promptResponse": "WOWZA"
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".DialogTester > :nth-child(2) .pt-intent-primary",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BkwFKbckX",
          "textContent": "Open alert",
          "textAsserted": false,
          "x": 81,
          "y": 272
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".alert-response",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJLxsWcy7",
          "value": "Alert dismissed.",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".DialogTester > :nth-child(4) .pt-intent-primary",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SJKgo-9JX",
          "textContent": "Open Dialog",
          "textAsserted": false,
          "x": 116,
          "y": 438
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".confirm-response",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Hyg3xjZck7",
          "value": "Dialog confirmed.",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".DialogTester > :nth-child(6) .pt-intent-primary",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r10ljZc1Q",
          "textContent": "Open Prompt",
          "textAsserted": false,
          "x": 77,
          "y": 567
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".prompt-response",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rygWs-qy7",
          "value": "WOWZA",
          "regex": false
        },
        {
          "type": "REFRESH",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HyCMiZ5JQ"
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HyH8jbqkm",
          "value": "/test-playground/dialog.+",
          "regex": true
        },
        {
          "type": "DIALOG",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJI7o-5yQ",
          "alert": true,
          "confirm": false,
          "prompt": true,
          "promptResponse": true
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".DialogTester > :nth-child(4) .pt-intent-primary",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ByPNsW9ym",
          "textContent": "Open Dialog",
          "textAsserted": false,
          "x": 101,
          "y": 397
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".confirm-response",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BkKBsb917",
          "value": "Dialog cancelled.",
          "regex": false
        }
      ],
      "variables": [
        {
          "id": "rkeVwt-917",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "H1meOevTNQ",
      "name": "Miscellanous",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SyZfMdSckm",
          "value": "/test-playground/miscellaneous",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SyGG_S9yQ",
          "value": "${baseUrl}/test-playground/miscellaneous",
          "isInitialLoad": false,
          "width": 1354,
          "height": 716
        },
        {
          "type": "MOUSEOVER",
          "selector": ".pt-button",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1UMdr5y7"
        },
        {
          "type": "FOCUS",
          "selector": ".padded-1 > :nth-child(6) input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HkRJfUck7"
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2)",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": 1000,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": true,
          "id": "SJFyKSc1m",
          "value": "hovered",
          "regex": false
        },
        {
          "type": "DOUBLECLICK",
          "selector": ".padded-1 > :nth-child(4) .pt-intent-primary",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HylfKB91X"
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(4) > div:nth-of-type(2)",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Hkt7tB5y7",
          "value": "double-clicked",
          "regex": false
        },
        {
          "type": "PAUSE",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SJBAJSIeQ",
          "value": 500
        },
        {
          "type": "KEYDOWN",
          "selector": ".padded-1 > :nth-child(4) input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HyG3-8qk7",
          "keyValue": "Enter"
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(5) > div:nth-of-type(2)",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": 1000,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": true,
          "id": "BJL0WLq1m",
          "value": "enter pressed",
          "regex": false
        },
        {
          "type": "BLUR",
          "selector": ".padded-1 > :nth-child(6) input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJieMLqyX"
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(6) > div:nth-of-type(2)",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BkNMfIqkQ",
          "value": "element focused",
          "regex": false
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(6) > div:nth-of-type(3)",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ByeNMf8ckm",
          "value": "element blurred",
          "regex": false
        },
        {
          "type": "EXECUTE_SCRIPT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "",
          "timeout": 1000,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ByPwzLcJ7",
          "script": "var el = document.querySelector(\".test-to-change\");\n\nel.innerHTML = \"Content changed\";\nel.style.background = \"red\";\nel.style.color = \"white\";\n\nreturn true;"
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".test-to-change",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HkGoGU9yQ",
          "value": "Content changed",
          "regex": false
        },
        {
          "type": "STYLE_ASSERT",
          "selector": ".test-to-change",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ryKHQU9Jm",
          "value": "rgb(255, 255, 255)",
          "regex": false,
          "style": "color"
        }
      ],
      "variables": [
        {
          "id": "BklfzuSqy7",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "rJ4lugD6Em",
      "name": "Form Submissions",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Hyb337-qy7",
          "value": "/test-playground/formsubmission",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S13hXZ5Jm",
          "value": "${baseUrl}/test-playground/formsubmission",
          "isInitialLoad": false,
          "width": 869,
          "height": 716
        },
        {
          "type": "MOUSEDOWN",
          "selector": "#emailtest",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1X6X-5kX",
          "textContent": null,
          "textAsserted": false,
          "x": 219,
          "y": 302
        },
        {
          "type": "INPUT",
          "selector": "#emailtest",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Sk-XTX-cyX",
          "value": "asdf@asdf.com",
          "inputType": "email",
          "isContentEditable": false
        },
        {
          "type": "INPUT",
          "selector": "#passwordtest",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rkxr6Q-9k7",
          "value": "asdfasdf",
          "inputType": "password",
          "isContentEditable": false
        },
        {
          "type": "SUBMIT",
          "selector": ".ajax-form",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HJKp7Wcym"
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".emailtest",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BkRTQb5km",
          "value": "asdf@asdf.com",
          "regex": false
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".passwordtest",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S1JA7W5J7",
          "value": "asdfasdf",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": "div:nth-of-type(2) > form > div > div > div > input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S1hfB-917",
          "textContent": null,
          "textAsserted": false,
          "x": 286,
          "y": 366
        },
        {
          "type": "INPUT",
          "selector": "div:nth-of-type(2) > form > div > div > div > input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Byg6GBb51m",
          "value": "asdf@asdf.com",
          "inputType": "email",
          "isContentEditable": false
        },
        {
          "type": "INPUT",
          "selector": "div:nth-of-type(2) > form > div:nth-of-type(2) > div > div > input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HJe1mS-qJm",
          "value": "asdfasdf",
          "inputType": "password",
          "isContentEditable": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".FormSubmitTester > :nth-child(6) .pt-intent-primary",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJbmBZ9yX",
          "textContent": "Submit",
          "textAsserted": false,
          "x": 252,
          "y": 477
        },
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r1bXr-5J7",
          "value": "/test-playground/formsubmission-success",
          "index": null
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "By-XB-qkm",
          "value": "/test-playground/formsubmission-succes+",
          "regex": true
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > h1",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HkU7Hbq1Q",
          "value": "Form Submission Success!",
          "regex": false
        }
      ],
      "variables": [
        {
          "id": "HJlhnXWqJm",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "rkreOeDTNQ",
      "name": "Form Input Types",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJbg1Ye5k7",
          "value": "/test-playground/forms",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "enters '${baseUrl}/test-playground/forms' into the browsers url bar",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ryeJKe91X",
          "value": "${baseUrl}/test-playground/forms",
          "isInitialLoad": false,
          "width": 1368,
          "height": 716
        },
        {
          "type": "MOUSEDOWN",
          "selector": "#example-form-group-input-a",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"example text\" input",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SJByKgqJm",
          "textContent": null,
          "textAsserted": false,
          "x": 408,
          "y": 292
        },
        {
          "type": "INPUT",
          "selector": "#example-form-group-input-a",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "changes the \"example test\" input to \"Inputting text input into the text input\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S1xqyKeqJm",
          "value": "Inputting text input into the text input",
          "inputType": "text",
          "isContentEditable": false
        },
        {
          "type": "VALUE_ASSERT",
          "selector": "#example-form-group-input-a",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"text\" input is \"Inputting text input into the text input\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJhdYl9ym",
          "value": "Inputting text input into the text input",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".LinksTester > :nth-child(3) .pt-input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"disabled example\" input",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJSbtgc17",
          "textContent": null,
          "textAsserted": false,
          "x": 333,
          "y": 299
        },
        {
          "type": "INPUT",
          "selector": ".LinksTester > :nth-child(4) .pt-input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "changes the \"number\" input to \"1234\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rkTGFx51Q",
          "value": "1234",
          "inputType": "number",
          "isContentEditable": false
        },
        {
          "type": "VALUE_ASSERT",
          "selector": ".LinksTester > :nth-child(4) .pt-input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"number\" input is \"1234\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SystKgcyX",
          "value": "1234",
          "regex": false
        },
        {
          "type": "INPUT",
          "selector": ".LinksTester > :nth-child(5) .pt-input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "changes the \"email\" input to \"asdf@asdf.com\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BkgEaFxcyX",
          "value": "asdf@asdf.com",
          "inputType": "email",
          "isContentEditable": false
        },
        {
          "type": "VALUE_ASSERT",
          "selector": ".LinksTester > :nth-child(5) .pt-input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"email\" input is \"asdf@asdf.com\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "By5aKecJ7",
          "value": "asdf@asdf.com",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".LinksTester > :nth-child(6) label",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"checkbox\" input",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S1N0Fx5kX",
          "textContent": "Regular checkbox",
          "textAsserted": false,
          "x": 78,
          "y": 397
        },
        {
          "type": "VALUE_ASSERT",
          "selector": ".LinksTester > :nth-child(6) input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"checkbox\" input is \"true\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1_Rtlckm",
          "value": "true",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".LinksTester > :nth-child(7) .pt-control-indicator",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"custom checkbox\" input",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Hy6RKlc1X",
          "textContent": null,
          "textAsserted": false,
          "x": 58,
          "y": 394
        },
        {
          "type": "VALUE_ASSERT",
          "selector": ".pt-control.pt-switch input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"custom checkbox\" input is \"true\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S11J5x9k7",
          "value": "true",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": "div:nth-of-type(2) > div:nth-of-type(7) > div > div > label",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1iT2g9yX",
          "textContent": "Native Radio button A",
          "textAsserted": false,
          "x": 95,
          "y": 345
        },
        {
          "type": "VALUE_ASSERT",
          "selector": "div:nth-of-type(2) > div:nth-of-type(7) > div > div > label > input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJZC3e5J7",
          "value": "true",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": "div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(8) > div > label",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "By-k6ec1X",
          "textContent": null,
          "textAsserted": false,
          "x": 62,
          "y": 438
        },
        {
          "type": "VALUE_ASSERT",
          "selector": "[name=docs-radio-regular]",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r11xalcy7",
          "value": "true",
          "regex": false
        },
        {
          "type": "INPUT",
          "selector": "div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(9) > div > select",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B1WjTe917",
          "value": "2",
          "inputType": "select-one",
          "isContentEditable": false
        },
        {
          "type": "VALUE_ASSERT",
          "selector": "div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(9) > div > select",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r1ywTgcyX",
          "value": "2",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".LinksTester > :nth-child(11) .pt-input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Skiwpx5JX",
          "textContent": "Test text area",
          "textAsserted": false,
          "x": 152,
          "y": 500
        },
        {
          "type": "INPUT",
          "selector": ".LinksTester > :nth-child(11) .pt-input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJbjwaeqJQ",
          "value": "Test text area bla bla",
          "inputType": "textarea",
          "isContentEditable": false
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".LinksTester > :nth-child(11) .pt-input",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SkZ_Tl91m",
          "value": "Test text area",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": ".editable-div",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJr_6l9k7",
          "textContent": "Editablecontent test",
          "textAsserted": false,
          "x": 226,
          "y": 602
        },
        {
          "type": "INPUT",
          "selector": ".editable-div",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HJWHOpg9yX",
          "value": "Editablecontent stuff...",
          "isContentEditable": true
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".editable-div",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJ5upeqJX",
          "value": "Editablecontent stuff...",
          "regex": false
        }
      ],
      "variables": [
        {
          "id": "ByxlkKgqkm",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "rJIlugD6Em",
      "name": "Dynamic Variables",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B1bhW8b917",
          "value": "/test-playground/forms",
          "index": null,
          "indent": 0
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJnbLbq17",
          "value": "${baseUrl}/test-playground/forms",
          "isInitialLoad": false,
          "width": 871,
          "height": 716,
          "indent": 0
        },
        {
          "type": "DYNAMIC_VAR",
          "selector": ".LinksTester > :nth-child(7) .pt-control",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HJ-MLZ917",
          "value": "myVar1",
          "indent": 0
        },
        {
          "type": "MOUSEDOWN",
          "selector": "div > div:nth-of-type(3) > div > a:nth-of-type(4)",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Hkt8Ib51Q",
          "textContent": "Form Submissions",
          "textAsserted": false,
          "x": 521,
          "y": 190,
          "indent": 0
        },
        {
          "type": "PUSHSTATE",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HktILZ9kQ",
          "value": "/test-playground/formsubmission",
          "index": 5,
          "indent": 0
        },
        {
          "type": "INPUT",
          "selector": "#emailtest",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B1LTU-q1Q",
          "value": "${myVar1}",
          "indent": 0
        },
        {
          "type": "VALUE_ASSERT",
          "selector": "#emailtest",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B1GEIbc1m",
          "value": "Custom checkbox",
          "regex": false,
          "indent": 0
        }
      ],
      "variables": [
        {
          "id": "r1e2-U-5y7",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "BJvxdeD6E7",
      "name": "Refreshing",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Syx-tCx9JX",
          "value": "/test-playground/caches",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HkbFAgqkm",
          "value": "${baseUrl}/test-playground/caches",
          "isInitialLoad": false,
          "width": 833,
          "height": 716
        },
        {
          "type": "MOUSEDOWN",
          "selector": "body > :nth-child(1) button",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rkRYCxqyQ",
          "textContent": "Check cookie value",
          "textAsserted": false,
          "x": 140,
          "y": 300
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".the-cookie",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1kcAeqy7",
          "value": "MAH COOKEH!",
          "regex": false
        },
        {
          "type": "REFRESH",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B1M90x5JX"
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SJXLk-c1m",
          "value": "/test-playground/cache.+",
          "regex": true
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".the-cookie",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Bka5Rg9Jm",
          "value": "Null",
          "regex": false
        }
      ],
      "variables": [
        {
          "id": "HJl8UAlc1Q",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "B1Oe_lvpNX",
      "name": "Links & Navigation",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HyZD1dlcJ7",
          "value": "/test-playground/caches",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "enters '${baseUrl}/test-playground/forms' into the browsers url bar",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SJPyux5y7",
          "value": "${baseUrl}/test-playground/forms",
          "isInitialLoad": false,
          "width": 1368,
          "height": 716
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(2) > h1",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"header\" element's text is \"Forms Test:\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "By8gdlqJX",
          "value": "Forms Test:",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": "div > div:nth-of-type(3) > div > a:nth-of-type(2)",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"dialogs link\" link",
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJqgdlc1X",
          "textContent": "Dialogs (Pushstate Link)",
          "textAsserted": false,
          "x": 444,
          "y": 192
        },
        {
          "type": "PUSHSTATE",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rk9edg9J7",
          "value": "/test-playground/dialogs",
          "index": 4
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the url's path is \"/test-playground/dialogs\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1jWOx5ym",
          "value": "/test-playground/dialogs",
          "regex": false
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(2) > h1",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"header\" element's text is \"Dialog Test:\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B12gul9km",
          "value": "Dialog Test:",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": "div > div:nth-of-type(3) > div > a:nth-of-type(3)",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"caches\" link",
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BkCgOe5JQ",
          "textContent": "Caches (href link)",
          "textAsserted": false,
          "x": 579,
          "y": 194
        },
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJkZuecJX",
          "value": "/test-playground/caches",
          "index": null
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the url's path is \"/test-playground/caches\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SyJWOgcyQ",
          "value": "/test-playground/cache.+",
          "regex": true
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(2) > h1",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"header\" element's text is \"Cache Test:\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rklZOgcJm",
          "value": "Cache Test:",
          "regex": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": "div > div:nth-of-type(3) > div > a",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"forms\" link",
          "timeout": null,
          "warnings": [
            "Couldn't find a good selector strategy to target this element. "
          ],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ryz-de5JX",
          "textContent": "Forms (href link)",
          "textAsserted": false,
          "x": 335,
          "y": 192
        },
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ryQWOlq1X",
          "value": "/test-playground/forms",
          "index": null
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the url's path is \"/test-playground/forms\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B17-Og5km",
          "value": "/test-playground/form.+",
          "regex": true
        },
        {
          "type": "TEXT_ASSERT",
          "selector": "div > div:nth-of-type(3) > div:nth-of-type(2) > h1",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"header\" element's text is \"Forms Test:\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HJVbdl5JX",
          "value": "Forms Test:",
          "regex": false
        },
        {
          "type": "BACK",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BkzCAxqJQ"
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Hk8WJWqJ7",
          "value": "/test-playground/cache.+",
          "regex": true
        },
        {
          "type": "BACK",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rk0JkWqy7"
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B1p0Aeq17",
          "value": "/test-playground/dialog.+",
          "regex": true
        },
        {
          "type": "FORWARD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r1fZ1W51m"
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SkAMyW9ym",
          "value": "/test-playground/cache.+",
          "regex": true
        },
        {
          "type": "FORWARD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJ7MJZckX"
        },
        {
          "type": "PATH_ASSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ByBx1-qyQ",
          "value": "/test-playground/form.+",
          "regex": true
        }
      ],
      "variables": [
        {
          "id": "B1lwJugc17",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "HyFedeP6EX",
      "name": "Cookie Clearing",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rkgtZDx5k7",
          "value": "/test-playground/caches",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "enters '${baseUrl}/test-playground/caches' into the browsers url bar",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ByYWve9kQ",
          "value": "${baseUrl}/test-playground/caches",
          "isInitialLoad": false,
          "width": 1368,
          "height": 716,
          "resize": false,
          "complete": false
        },
        {
          "type": "MOUSEDOWN",
          "selector": "body > :nth-child(1) button",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"check cookie\" button",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Bk9mvl9kQ",
          "textContent": "Check cookie value",
          "textAsserted": false,
          "x": 362,
          "y": 300
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".the-cookie",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"cookie value\" element's text is \"MAH COOKEH!\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rymMvlcyQ",
          "value": "MAH COOKEH!",
          "regex": false
        },
        {
          "type": "CLEAR_COOKIES",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clears cookies for the \"${baseUrl}\" domain",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Bkifvgq1m",
          "value": "${baseUrl}"
        },
        {
          "type": "MOUSEDOWN",
          "selector": "body > :nth-child(1) button",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "clicks on the \"check cookie\" button",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJs3Dlc1X",
          "textContent": "Check cookie value",
          "textAsserted": false,
          "x": 339,
          "y": 300
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".the-cookie",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "verifies that the \"cookie value\" element's text is \"Null\"",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BJWMwg5yX",
          "value": "Null",
          "regex": false
        }
      ],
      "variables": [
        {
          "id": "HkxGQcDmyX",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "HyqgdlwaVQ",
      "name": "Cache clearing",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "B1ZO6snHgX",
          "value": "/test-playground/caches",
          "index": null
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1dD2hrlQ",
          "value": "${baseUrl}/test-playground/caches",
          "isInitialLoad": false,
          "width": 1440,
          "height": 726
        },
        {
          "type": "MOUSEDOWN",
          "selector": "body > :nth-child(1) button",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S1Em2nHe7",
          "textContent": "Check cookie value",
          "textAsserted": false,
          "x": 402,
          "y": 303
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".the-cookie",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rywX32SxQ",
          "value": "MAH COOKEH!",
          "regex": false
        },
        {
          "type": "CLEAR_CACHES",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "ryoS32Bgm",
          "cookieDomain": "${baseUrl}",
          "sessionstorage": true,
          "localstorage": true,
          "indexdb": true,
          "indexdbDatabases": "",
          "cookies": true
        },
        {
          "type": "MOUSEDOWN",
          "selector": "body > :nth-child(1) button",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "SyyY22HxX",
          "textContent": "Check cookie value",
          "textAsserted": false,
          "x": 125,
          "y": 298
        },
        {
          "type": "TEXT_ASSERT",
          "selector": ".the-cookie",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rkmFnnSgX",
          "value": "Null",
          "regex": false
        }
      ],
      "variables": [
        {
          "id": "r1eOTo3reX",
          "name": "baseUrl",
          "defaultValue": "https://www.snaptest.io",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    },
    {
      "id": "BJjgdxDpE7",
      "name": "Reddit Homepage Scraping",
      "actions": [
        {
          "type": "URL_CHANGE_INDICATOR",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "H1lgwbgIGQ",
          "value": "/",
          "index": null,
          "indent": 0
        },
        {
          "type": "FULL_PAGELOAD",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJgDWgUMQ",
          "value": "${baseUrl}/",
          "width": 825,
          "height": 677,
          "resize": false,
          "indent": 0,
          "complete": true
        },
        {
          "type": "EVAL",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "r1s0CYuGm",
          "value": "vars.loopIndex = 1",
          "indent": 0
        },
        {
          "type": "DOWHILE",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HyDj7ddzm",
          "value": {
            "type": "EL_PRESENT_ASSERT",
            "selector": ".linklisting > div:nth-child($(vars.loopIndex + \"\")) .title",
            "selectorType": "CSS",
            "nodeName": null,
            "description": null,
            "timeout": null,
            "warnings": [],
            "suggestions": [],
            "continueOnFail": false,
            "id": "SJlti7__MX"
          },
          "maxLoops": 0,
          "indent": 0
        },
        {
          "type": "EL_PRESENT_ASSERT",
          "selector": ".linklisting > div:nth-child($(vars.loopIndex + \"\")) .title",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "Bk6uGYOzX",
          "indent": 1
        },
        {
          "type": "CSV_INSERT",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": "",
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rJzgNZ3z7",
          "csvName": "reddit_homepage_links",
          "columns": [
            {
              "columnName": "Post title",
              "selector": ".linklisting > div:nth-child($(vars.loopIndex + \"\")) .title a",
              "select": "innerHTML"
            },
            {
              "columnName": "Post link",
              "selector": ".linklisting > div:nth-child($(vars.loopIndex + \"\")) .title a",
              "select": "href"
            }
          ],
          "indent": 1
        },
        {
          "type": "IF",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "HJQ-065GX",
          "value": {
            "type": "EVAL",
            "selector": "",
            "selectorType": "CSS",
            "nodeName": null,
            "description": null,
            "timeout": null,
            "warnings": [],
            "suggestions": [],
            "continueOnFail": false,
            "id": "B1eD-0aczX",
            "value": "vars.loopIndex / 2 > 30"
          },
          "indent": 1
        },
        {
          "type": "BREAK",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rk5Xf05zm",
          "indent": 2
        },
        {
          "type": "EVAL",
          "selector": "",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": 1,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "BkblqdOzQ",
          "value": "exports.loopIndex+=2",
          "indent": 1
        },
        {
          "type": "INPUT",
          "selector": "[name=q]",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "S1CzHejMm",
          "value": "$(parseInt(vars.loopIndex / 2))",
          "indent": 1
        },
        {
          "type": "INPUT",
          "selector": "[name=q]",
          "selectorType": "CSS",
          "nodeName": null,
          "description": null,
          "timeout": null,
          "warnings": [],
          "suggestions": [],
          "continueOnFail": false,
          "id": "rydN6a5fX",
          "value": "finished",
          "indent": 0
        }
      ],
      "variables": [
        {
          "id": "BygA2d1LG7",
          "name": "baseUrl",
          "defaultValue": "https://old.reddit.com",
          "type": "STRING_VAR"
        }
      ],
      "type": "test"
    }
  ];
  var folderNode = {
    "collapsed": false,
    "module": "Examples",
    "id": "Hkqvbva4Q",
    "children": [
      {
        "id": "ryZlxugwaEm",
        "testId": "rJ4lugD6Em",
        "type": "test"
      },
      {
        "id": "HJHeg_ew64X",
        "testId": "B1Oe_lvpNX",
        "type": "test"
      },
      {
        "id": "H1fledgwTEQ",
        "testId": "rkreOeDTNQ",
        "type": "test"
      },
      {
        "id": "ByRlOgvTNQ",
        "testId": "Sy-gdgw6Nm",
        "type": "test"
      },
      {
        "id": "BJNegOlPTNX",
        "testId": "BJvxdeD6E7",
        "type": "test"
      },
      {
        "id": "rkvgguxvpVm",
        "testId": "HyqgdlwaVQ",
        "type": "test"
      },
      {
        "id": "Hk8egdxDpNm",
        "testId": "HyFedeP6EX",
        "type": "test"
      },
      {
        "id": "SkJlxdgPpNm",
        "testId": "rkfxOxPTEX",
        "type": "test"
      },
      {
        "id": "rJglxugDp47",
        "testId": "H1meOevTNQ",
        "type": "test"
      },
      {
        "collapsed": false,
        "module": "Advanced Flow Control",
        "id": "ryLeGwaVQ",
        "children": [
          {
            "id": "S13luxwaNm",
            "testId": "Hkldgv6VQ",
            "type": "test"
          },
          {
            "id": "HJTlOxv6VQ",
            "testId": "BJxgdxDTVX",
            "type": "test"
          },
          {
            "id": "S1Xxl_ePpNm",
            "testId": "rJIlugD6Em",
            "type": "test"
          }
        ]
      },
      {
        "collapsed": false,
        "module": "Data Scraping",
        "id": "S16gGD64Q",
        "children": [
          {
            "id": "r1OelOlw6NX",
            "testId": "BJjgdxDpE7",
            "type": "test"
          }
        ]
      }
    ]
  };

  var idMapping = {};

  tests.forEach((test) => {
    var newId = generateId();
    idMapping[test.id] = newId;
    test.id = newId;
  });

  walkThroughTreeNodes(folderNode, (node) => {
    if (node.type === "test" || node.type === "component") {
      node.id = generateId();
      node.testId = idMapping[node.testId];
    } else {
      node.id = generateId();
      state.openFolders.push(node.id);
    }
  });

  state.tests.push(...tests);
  state.directory.tree.children.push(folderNode);

  repairDirectory(state); // just in case.

};


export const deleteFolder = (params, state) => {

  const { folderId } = params;
  const { contextType, contextId } = state;

  var sourceFolder = findNodeById(state.directory.tree, folderId);
  var testsToRemove = [];
  var componentsToRemove = [];

  walkThroughTreeNodes(sourceFolder, (node) => {
    if (node.testId) {
      if (node.type === "test") testsToRemove.push(_.find(state.tests, {id: node.testId}));
      if (node.type === "component") componentsToRemove.push(_.find(state.components, {id: node.testId}));
    }
  });

  testsToRemove = testsToRemove.map((test) => ({...test, toDelete: true}));
  componentsToRemove = componentsToRemove.map((test) => ({...test, toDelete: true}));

  removeNodeFromTree(state.directory.tree, sourceFolder.id);

  if (state.localmode) {
    testsToRemove.forEach((test) => {
      var idxOfTest = _.findIndex(state.tests, {id: test.id});
      if (idxOfTest !== -1) state.tests.splice(idxOfTest, 1)
    });
    componentsToRemove.forEach((test) => {
      var idxOfTest = _.findIndex(state.components, {id: test.id});
      if (idxOfTest !== -1) state.components.splice(idxOfTest, 1)
    });
    LocalActions.cacheLocalMode(state);
    buildComponentInstanceSummary({}, state);
  } else {
    return saveInBatches(state.user.apikey, contextType, contextId, [{ type: "directory", directory: state.directory }])
      .then(() => saveInBatches(state.user.apikey, contextType, contextId, [...testsToRemove, ...componentsToRemove]))
      .then(() => getTestData({}, state))
      .then(() => repairDirectory(state))
      .then(() => buildComponentInstanceSummary({}, state))
  }

};

export const copyTestToAccount = (params, state) => {

  const { testId, contextType, contextId } = params;


  var test = _.find(state.tests, {id: testId});
  if (!test) test = _.find(state.components, {id: testId});

  var copiedTest = deepClone(test);
  copiedTest.id = generateId();

  return saveInBatches(state.user.apikey, contextType, contextId, [copiedTest]);

};

export const copyFolderToAccount = (params, state) => {

  const { folderId, contextType, contextId } = params;
  const { localmode } = state;

  var sourceFolder = findNodeById(state.directory.tree, folderId);
  var oldToNewIdMap = {};
  var testsToCopy = [];

  // find all tests and components to copy.
  walkThroughTreeNodes(sourceFolder, (node) => {
    if (node.testId) testsToCopy.push(_.find(node.type === "test" ? state.tests : state.components, {id: node.testId}));
  });

  // gather all dependent component ids
  var testsSearched = [];
  var componentIdsToCopy = [];

  function getDependentComponents(tests) {

    if (tests.length === 0) return; // base case: no more tests to search for dependents

    var moreTestsToSearch = [];

    tests.forEach((test) => {
      if (test && testsSearched.indexOf(test.id) === -1) {
        test.actions.forEach((action) => {
          if (action.type === "COMPONENT" && action.componentId && componentIdsToCopy.indexOf(action.componentId) === -1) {
            componentIdsToCopy.push(action.componentId);
            moreTestsToSearch.push(_.find(state.components, {id: action.componentId}));
          }
        });
        testsSearched.push(test.id);
      }
    });

    getDependentComponents(moreTestsToSearch);

  }

  // recursively search for dependent components
  getDependentComponents(testsToCopy);

  // dedup components to be copied
  componentIdsToCopy = componentIdsToCopy.filter((componentId) => !_.find(testsToCopy, {id: componentId}));

  // add new components to be copied.
  componentIdsToCopy.map((componentId) => {
    var component = _.find(state.components, {id: componentId});
    if (component) testsToCopy.push(component);
  });

  // duplicate test entities and change id's
  var duppedTests = testsToCopy.map((test) => {
    var newId = generateId();
    var duppedTest = deepClone(test);
    oldToNewIdMap[test.id] = newId;
    duppedTest.id = newId;
    return duppedTest;
  });

  // update references to components in actions for components;
  duppedTests.forEach((test) => {
    test.actions.forEach((action) => {
      if (action.type === "COMPONENT") {
        action.componentId = oldToNewIdMap[action.componentId];
      }
    })
  });

  // clone subtree, update references to new test ids, and add leafs for the new components to be copied.
  var duppedSourceFolder = deepClone(sourceFolder);

  walkThroughTreeNodes(duppedSourceFolder, (node) => {
    if (node.testId) node.testId = oldToNewIdMap[node.testId];
    node.id = generateId();
  });

  duppedSourceFolder.module += " (copied)";

  duppedTests.forEach((test) => {
    if (!findNode(duppedSourceFolder, {testId: test.id})) {
      duppedSourceFolder.children.unshift({type: test.type, testId: test.id, id: generateId() });
    }
  });

  if (contextType) {
    return loadItems(state.user.apikey, contextType, contextId)
      .then((data) => {

        // update data
        data.directory.tree.children.unshift(duppedSourceFolder);

        // save all new tests with new batch method.
        return saveInBatches(state.user.apikey, contextType, contextId, [{ type: "directory", directory: data.directory }].concat(duppedTests));

      })
      .then(() => {
        if (!localmode) return getTestData({}, state);
        else return new Promise((resolve) => resolve());
      });
  } {

    var localModeCache = LocalActions.getLocaCache();
    localModeCache.tests = localModeCache.tests.concat(duppedTests.filter((test) => test.type === "test"));
    localModeCache.components = localModeCache.components.concat(duppedTests.filter((test) => test.type === "component"));
    localModeCache.directory.tree.children.unshift(duppedSourceFolder);
    LocalActions.saveEditedCache(localModeCache);

    return new Promise((resolve) => resolve());
  }


};

export const buildComponentInstanceSummary = (params, state) => {

  const {} = params;
  const {tests, components} = state;

  var testsAndComps = [...state.tests, ...state.components];

  state.compInstanceSummary = state.components.reduce((prev, next) => {

    if (prev[next.id]) return prev;

    var testCompInstances = testsAndComps.map((test) => {
      return {
        id: test.id,
        name: test.name,
        type: test.type,
        instances: test.actions.filter((action) =>
          action.type === "COMPONENT" &&
          action.componentId === next.id
        )
      }
    }).filter((test) => test.instances.length > 0);

    prev[next.id] = {
      count: testCompInstances.reduce((a, b) => a + b.instances.length, 0),
      tests: testCompInstances
    };

    return prev;

  } , {});

  return Promise.resolve();

};