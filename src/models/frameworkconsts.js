export const FRAMEWORK_OPTIONS = [
  {
    name: "NightwatchJS",
    value: "nightwatch",
    styles: [{
      name: "Flat",
      value: "flat",
      definition: require('../generators/_shared/nightwatch/definitions/flat')
    }, {
      name: "Page Objects",
      value: "pageobjects",
      disabled: true
    }]
  },
  {
    name: "Chromeless",
    disabled: false,
    value: "chromeless",
    styles: [
      {
        name: "Prototyper",
        value: "prototype",
        definition: require('../generators/_shared/chromeless/definitions/prototype')
      },
      {
        name: "Flat",
        value: "flat",
        definition: require('../generators/_shared/chromeless/definitions/flat')
      }]
  },
  {
    name: "TestCafe",
    disabled: true,
    value: "testcafe",
    styles: []
  },
  {
    name: "Java",
    disabled: true,
    value: "java",
    styles: []
  },
  {
    name: "Cypress.io",
    disabled: true,
    value: "cypressio",
    styles: []
  },
  {
    name: "Webdriver.io",
    disabled: true,
    value: "webdriverio",
    styles: []
  },
];