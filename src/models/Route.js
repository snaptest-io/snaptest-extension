import {generate as generateId} from 'shortid'

export default class Route {

  name = "404";
  data = {};
  id = generateId();

  constructor(name, data, options = {}) {
    if (name) this.name = name;
    if (data) this.data = data;
    this.options = options
  }

}

export const ROUTE_DISPLAY = {
  "testbuilder": "Test Editor",
  "dashboard": "Dashboard",
  "dataprofiles": "Environments",
  "results": "Results",
  "codeviewer": "View Code",
  "multiplayback": "Run Folder",
};