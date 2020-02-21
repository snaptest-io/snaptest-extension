import {generate as generateId} from 'shortid'

export default class DataProfile {

  id = generateId();
  name = "";
  variables = [];

  constructor(name, variables) {
    this.name = name;
    this.variables = variables;
    this.profileId = this.id;
  }

}

