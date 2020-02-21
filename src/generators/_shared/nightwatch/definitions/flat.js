var ActionConsts = require('../../ActionConsts');

module.exports = {
  name: "Nightwatch Generator(flat)",
  description: "Full-project NightwatchJS generator. ",
  beta: false,
  singleTest:
      `
        <div>
          <div>You are viewing the code for a single test.  It contains all the required dependencies in one file.  In order to run with Selenium, follow the install instructions here: <a target="_blank" href="https://github.com/ozymandias547/snaptest-harness">SnapTest NW Scaffold</a> </div>
          <div>Entire project/folder generation is available by clicking the "CODE" button in the test directory view.</div>
        </div>
      `,
  multi:
    `
      <div>
        <p>Generating the tests without a harness assumes you have already set up a nightwatchJS test project. </p>
        <p>
          <div>Requirements to generate:</div>
          <ul className="req-list">
            <li><a target="_blank" href="https://www.npmjs.com/package/snaptest-cli">SnapTest CLI (npm package)</a></li>
          </ul>
        </p>
      </div>
    `,
  frameworkFlag: "chromeless",
  harnessCommand: "git clone https://github.com/ozymandias547/snaptest-harness.git && cd snaptest-harness && npm install && ",
  styleFlag: "flat",
  cliSupport: true,
  actionSupport: [
    { action: ActionConsts.PAGELOAD, support: 1, details: "supported" }
  ]
};
