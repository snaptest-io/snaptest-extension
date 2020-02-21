import {generate as generateId} from 'shortid'

export default class Component {

  name = "Unnamed component";
  actions = [];
  id = generateId();
  isBlank = true;
  type = "component";
  variables = [];

  constructor(name, actions) {
    if (name) { this.name = name; this.isBlank = false; }
    if (actions) { this.actions = actions; this.isBlank = false; }
  }

}