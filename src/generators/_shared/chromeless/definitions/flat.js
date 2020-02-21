var ActionConsts = require('../../ActionConsts');

module.exports = {
  name: "SnapTest Chromeless Generator",
  description: "Full-project generator for the Chromeless API.  ",
  singleTest: `
      <p><b>Note: </b>Attempts to fully implement SnapTest actions using the Chromeless API, but it's not there 100% yet.</p>
      <p><b>Instructions</b></p>
      <ul>
         <li>Follow steps on <a href="https://github.com/ozymandias547/snaptest-chromeless" target="_blank">the SnapTest Chromeless project harness</a>.</li>
      </ul>
  `,
  multi: `
      <p><b>Note: </b>Attempts to fully implement SnapTest actions using the Chromeless API, but it's not there 100% yet.</p>
      <p><b>Instructions</b></p>
      <ul>
         <li>Follow steps at <a href="https://github.com/ozymandias547/snaptest-chromeless" target="_blank">the SnapTest Chromeless project harness</a>.</li>
      </ul>
  `,
  frameworkFlag: "chromeless",
  styleFlag: "flat",
  harnessCommand: "",
  cliSupport: true,
  beta: true,
  actionSupport: [
    { action: ActionConsts.PAGELOAD, support: 1, details: "supported" }
  ]
};


