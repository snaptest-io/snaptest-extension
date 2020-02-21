import {generate as generateId} from 'shortid'

const STRING_VAR = "STRING_VAR";
const ENV_VAR = "ENV_VAR";
const NUMBER_VAR = "NUMBER_VAR";

export const SYSTEM_VARS = [
  {
    name: "random",
    defaultValue: "(A random integer - each instance different)",
    system: true
  },
  {
    name: "random1",
    defaultValue: "(A random integer - persisted)",
    system: true
  },
  {
    name: "random2",
    defaultValue: "(A random integer - persisted)",
    system: true
  },
  {
    name: "random3",
    defaultValue: "(A random integer - persisted)",
    system: true
  }
];

export class Variable {

  id = generateId();
  name = "";

  constructor(name) {
    this.name = name;
  }

}


export class StringVariable extends Variable {

  defaultValue = "";
  type = STRING_VAR;

  constructor(name, defaultValue) {
    super(name);
    if (defaultValue) this.defaultValue = defaultValue;
  }

}

export class EnvVariable extends Variable {

  defaultValue = "";
  type = ENV_VAR;

  constructor(defaultValue) {
    super();
    if (defaultValue) this.defaultValue = value;
  }

}

export class NumberVariable extends Variable {

  defaultValue = 0;
  type = NUMBER_VAR;

  constructor(name, defaultValue) {
    super(name);
    if (defaultValue) this.defaultValue = defaultValue;
  }

}

