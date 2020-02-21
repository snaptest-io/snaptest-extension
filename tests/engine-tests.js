
var components = [
  {
    id: "qwe",
    name: "my comp",
    actions: [
      { id: "a", type: "PAUSE", value: 10, indent: 0},
      { id: "b", type: "PAUSE", value: 10, indent: 0},
      { id: "c", type: "PAUSE", value: 10, indent: 0},
    ]
  },
  {
    id: "ewfws",
    name: "nested1",
    actions: [
      { id: "a", type: "PAUSE", value: 10, indent: 0},
      { id: "b", type: "COMP", compId: "afeas", indent: 0}
    ]
  },
  {
    id: "afeas",
    name: "nested2",
    actions: [
      { id: "a", type: "COMP", compId: "afsef", indent: 0},
      { id: "b", type: "PAUSE", value: 10, indent: 0},
    ]
  },
  {
    id: "afsef",
    name: "nested3",
    actions: [
      { id: "a", type: "PAUSE", value: 10, indent: 0}
    ]
  },
  {
    id: "iouoie",
    name: "haserror",
    actions: [
      { id: "a", type: "PAUSE", value: 10, indent: 0, error: true}
    ]
  }
];

var nullTest = [];

var basicTest = [
  { id: "a", type: "PAUSE", value: 10, indent: 0},
  { id: "b", type: "PAUSE", value: 10, indent: 0},
  { id: "c", type: "PAUSE", value: 10, indent: 0},
  { id: "d", type: "PAUSE", value: 10, indent: 0},
  { id: "e", type: "PAUSE", value: 10, indent: 0},
]

var ifTest = [
  { id: "a", type: "PAUSE", value: 10, indent: 0},
  { id: "b", type: "IF", condition: true, indent: 0},
  { id: "c", type: "PAUSE", value: 10, indent: 1}
];

var ifTest2 = [
  { id: "a", type: "PAUSE", value: 10, indent: 0},
  { id: "b", type: "IF", condition: true, indent: 0},
  { id: "c", type: "PAUSE", value: 10, indent: 1},
  { id: "d", type: "IF", condition: true, indent: 1},
  { id: "e", type: "PAUSE", value: 10, indent: 2},
  { id: "f", type: "PAUSE", value: 10, indent: 2},
  { id: "g", type: "PAUSE", value: 10, indent: 0},
  { id: "h", type: "PAUSE", value: 10, indent: 0},
  { id: "i", type: "IF", condition: false, indent: 0},
  { id: "j", type: "PAUSE", value: 10, indent: 1},
  { id: "k", type: "PAUSE", value: 10, indent: 1},
  { id: "adsf", type: "IF", condition: true, indent: 0},
  { id: "ewfewf", type: "PAUSE", value: 10, indent: 0}
];

var ifWithActionConditional = [
  { id: "a", type: "PAUSE", value: 10, indent: 0},
  { id: "b", type: "IF", condition: [{id: "d", type: "PAUSE", value: 10, indent: 0}], indent: 0 },
  { id: "c", type: "PAUSE", value: 10, indent: 1}
];

var ifWithActionConditionalFailure = [
  { id: "a", type: "PAUSE", value: 100, indent: 0},
  { id: "b", type: "IF", condition: [{id: "e", type: "PAUSE", value: 100, error: true, indent: 0}], indent: 0 },
  { id: "c", type: "PAUSE", value: 100, indent: 1},
  { id: "d", type: "PAUSE", value: 100, indent: 1}
];

var ifElseTest = [
  { id: "b", type: "IF", condition: false, indent: 0},
  { id: "c", type: "PAUSE", value: 100, indent: 1},
  { id: "d", type: "ELSEIF", condition: false, indent: 0},
  { id: "e", type: "PAUSE", value: 100, indent: 1},
  { id: "f", type: "ELSE", indent: 0},
  { id: "g", type: "PAUSE", value: 100, indent: 1}
];

var ifElse2Test = [
  { id: "b", type: "IF", condition: false, indent: 0},
  { id: "c", type: "PAUSE", value: 100, indent: 1},
  { id: "d", type: "ELSEIF", condition: true, indent: 0},
  { id: "e", type: "PAUSE", value: 100, indent: 1},
  { id: "f", type: "ELSE", indent: 0},
  { id: "g", type: "PAUSE", value: 100, indent: 1}
];

var componentsInRowTest = [
  { id: "a", type: "COMP", compId: "qwe", indent: 1},
  { id: "b", type: "COMP", compId: "qwe", indent: 1},
  { id: "c", type: "COMP", compId: "qwe", indent: 1},
]

var nestedComponentsTest = [
  { id: "a", type: "COMP", compId: "ewfws", indent: 1}
]

var regularErrorTest = [
  { id: "a", type: "PAUSE", value: 10, indent: 0},
  { id: "b", type: "PAUSE", value: 10, indent: 0, error: true},
  { id: "c", type: "PAUSE", value: 10, indent: 0},
  { id: "d", type: "PAUSE", value: 10, indent: 0}
];

var nestedErrorTest = [
  { id: "a", type: "IF", condition: false, indent: 0},
  { id: "b", type: "ELSE", indent: 0},
  { id: "c", type: "IF", condition: true, indent: 1},
  { id: "d", type: "PAUSE", value: 100, indent: 2},
  { id: "e", type: "COMP", compId: "iouoie", indent: 2},
  { id: "f", type: "PAUSE", value: 10, indent: 0},
  { id: "g", type: "PAUSE", value: 10, indent: 0},
];

var tryTest = [
  { id: "a", type: "TRY", value: 10, indent: 0},
  { id: "b", type: "PAUSE", value: 10, indent: 1},
  { id: "c", type: "PAUSE", value: 10, indent: 1, error: true},
  { id: "g", type: "PAUSE", value: 10, indent: 1},
  { id: "d", type: "PAUSE", value: 10, indent: 1},
  { id: "e", type: "PAUSE", value: 10, indent: 0},
  { id: "f", type: "PAUSE", value: 10, indent: 0}
];

var tryCatchTest = [
  { id: "a", type: "PAUSE", value: 10, indent: 0},
  { id: "b", type: "TRY", indent: 0},
  { id: "c", type: "PAUSE", value: 10, indent: 1},
  { id: "d", type: "PAUSE", value: 10, indent: 1, error: true},
  { id: "e", type: "PAUSE", value: 10, indent: 1},
  { id: "f", type: "CATCH", indent: 0},
  { id: "g", type: "PAUSE", value: 10, indent: 1},
  { id: "h", type: "PAUSE", value: 10, indent: 1}
];

var tryCatchNestedTest = [
  { id: "a", type: "TRY", indent: 0},
  { id: "b", type: "IF", condition: false, indent: 1},
  { id: "c", type: "ELSE", indent: 1},
  { id: "d", type: "IF", condition: true, indent: 2},
  { id: "f", type: "COMP", compId: "iouoie", indent: 3},
  { id: "k", type: "PAUSE", value: 10, indent: 3},
  { id: "g", type: "CATCH", indent: 0},
  { id: "i", type: "PAUSE", value: 10, indent: 1}
];

var tryInATry = [
  { id: "a", type: "TRY", indent: 0},
  { id: "b", type: "TRY", indent: 1},
  { id: "c", type: "PAUSE", value: 10, indent: 2},
  { id: "d", type: "PAUSE", value: 10, indent: 2}
];

var catchInACatch = [
  { id: "a", type: "TRY", indent: 0},
  { id: "b", type: "TRY", indent: 1},
  { id: "d", type: "PAUSE", value: 10, indent: 2, error: true},
  { id: "e", type: "CATCH", indent: 1},
  { id: "f", type: "PAUSE", value: 10, indent: 2},
  { id: "k", type: "PAUSE", value: 10, indent: 2, error: true},
  { id: "g", type: "PAUSE", value: 10, indent: 2},
  { id: "h", type: "CATCH", indent: 0},
  { id: "i", type: "PAUSE", value: 10, indent: 1},
  { id: "j", type: "PAUSE", value: 10, indent: 1},
];

var gotoTest = [
  { id: "a", type: "PAUSE", value: 10, indent: 2},
  { id: "b", type: "GOTO", value: "d", indent: 2},
  { id: "c", type: "PAUSE", value: 10, indent: 2},
  { id: "d", type: "PAUSE", value: 10, indent: 2},
  { id: "e", type: "PAUSE", value: 10, indent: 2},
]

var basicPauseTest = [
  { id: "a", type: "PAUSE", value: 50, indent: 0},
  { id: "b", type: "PAUSE", value: 50, indent: 0},
  { id: "c", type: "PAUSE", value: 50, indent: 0},
  { id: "d", type: "PAUSE", value: 50, indent: 0},
  { id: "e", type: "PAUSE", value: 50, indent: 0},
  { id: "f", type: "PAUSE", value: 50, indent: 0},
  { id: "g", type: "PAUSE", value: 50, indent: 0},
  { id: "h", type: "PAUSE", value: 50, indent: 0},
]

var pauseInBlockTest = [
  { id: "a", type: "PAUSE", value: 25, indent: 0},
  { id: "b", type: "IF", condition: true, indent: 0},
  { id: "c", type: "PAUSE", value: 25, indent: 1},
  { id: "d", type: "IF", condition: true, indent: 1},
  { id: "e", type: "PAUSE", value: 25, indent: 2},
  { id: "f", type: "PAUSE", value: 25, indent: 2},
  { id: "g", type: "PAUSE", value: 25, indent: 2},
  { id: "h", type: "PAUSE", value: 25, indent: 2},
  { id: "i", type: "IF", condition: false, indent: 0},
  { id: "j", type: "PAUSE", value: 25, indent: 1},
  { id: "k", type: "PAUSE", value: 25, indent: 1},
  { id: "adsf", type: "IF", condition: true, indent: 0},
  { id: "ewfewf", type: "PAUSE", value: 25, indent: 0}
];



playbackManager(nullTest).begin()
  .then((results) => console.log("nullTest: %s", results.length === 0 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(basicTest).begin())
  .then((results) => console.log("basicTest: %s", results.length === 5 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(regularErrorTest).begin())
  .then((results) => console.log("regularErrorTest result: %s", results.length === 2 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(ifTest).begin())
  .then((results) => console.log("ifTest: %s", results.length === 3 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(ifTest2).begin())
  .then((results) => console.log("ifTest2: %s", results.length === 11 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(ifWithActionConditional).begin())
  .then((results) => console.log("ifWithActionConditional: %s", results.length === 4 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(ifWithActionConditionalFailure).begin())
  .then((results) => console.log("ifWithActionConditionalFailure: %s", results.length === 3 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(ifElseTest).begin())
  .then((results) => console.log("ifElseTest: %s", results.length === 3 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(ifElse2Test).begin())
  .then((results) => console.log("ifElse2Test: %s", results.length === 4 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(componentsInRowTest).begin())
  .then((results) => console.log("componentsInRowTest result: %s", results.length === 9 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(nestedComponentsTest).begin())
  .then((results) => console.log("nestedComponentsTest result: %s", results.length === 3 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(nestedErrorTest).begin())
  .then((results) => console.log("nestedErrorTest result: %s", results.length === 4 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(tryTest).begin())
  .then((results) => console.log("tryTest result: %s", results.length === 4 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(tryCatchTest).begin())
  .then((results) => console.log("tryCatchTest result: %s", results.length === 5 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(tryCatchNestedTest).begin())
  .then((results) => console.log("tryCatchNestedTest result: %s", results.length === 4 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(tryInATry).begin())
  .then((results) => console.log("tryInATry result: %s", results.length === 2 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(catchInACatch).begin())
  .then((results) => console.log("catchInACatch result: %s", results.length === 5 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(gotoTest).begin())
  .then((results) => console.log("gotoTest result: %s", results.length === 3 ? "PASSED" : "FAILED", results))
  .then(() => playbackManager(gotoForwardNested).begin())
  .then((results) => console.log("gotoTest result: %s", results.length === 3 ? "PASSED" : "FAILED", results))
  .then(() => console.log("COMPLETE"))
  .catch((e) => console.log(e))

var playbackInstance = playbackManager(basicPauseTest);

playbackInstance.begin().then((results) => console.log(results)).then(() => console.log("COMPLETE"));
setTimeout(() => {
    playbackInstance.pause();
    setTimeout(() => {
      console.log(Object.assign({}, {...playbackInstance.getStack()}));
      playbackInstance.resume();
    }, 100)
}, 150);

var playbackInstance2 = playbackManager(nestedErrorTest);
playbackInstance2.begin().then((results) => console.log(results));
setTimeout(() => {
    playbackInstance2.pause();
    setTimeout(() => {
        console.log(Object.assign({}, playbackInstance2.getStack()));
        playbackInstance2.resume();
    }, 2000);
}, 50);

var playbackInstance3 = playbackManager(ifWithActionConditionalFailure);
playbackInstance3.begin().then((results) => console.log(results));
setTimeout(() => {
    playbackInstance3.pause();
    console.log(Object.assign({}, playbackInstance3.getStack()));
    setTimeout(() => {
      playbackInstance3.step();
      playbackInstance3.step();
      playbackInstance3.resume();
    }, 10)
}, 250);
