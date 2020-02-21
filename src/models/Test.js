import {generate as generateId} from 'shortid'

export default class Test {

  name = "Unnamed test";
  description = "";
  actions = [];
  id = generateId();
  type = "test";
  variables = [];

  constructor(name) {
    if (name) this.name = name;
  }

}