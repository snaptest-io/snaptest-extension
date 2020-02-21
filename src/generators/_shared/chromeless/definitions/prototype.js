module.exports = {
  name: "Chromeless Prototyper",
  description: "Designed to quickly prototype Chromeless code.",
  singleTest: `
      <p><b>Note: </b>Does not fully implement SnapTest actions yet.</p>
      <p>To run these tests:</p>
      <ul>
         <li>Copy and paste into <a href="https://chromeless.netlify.com/" target="_blank">The Chromeless playground</a>.</li>
         <li>Use <a href="https://github.com/ozymandias547/snaptest-chromeless" target="_blank">the SnapTest Chromeless project harness</a>.</li>
      </ul>
   `,
  multi: "",
  multiHarness: "",
  frameworkFlag: "chromeless",
  styleFlag: "prototype",
  harnessCommand: "",
  cliSupport: false,
  beta: true
};
