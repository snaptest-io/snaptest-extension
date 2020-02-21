import {generate as generateId} from 'shortid'

export default class Test {

  name = "Unnamed request";
  description = "";
  id = generateId();
  type = "request";
  variables = [];
  method = "get";
  url = "${baseUrl}/";
  headers = [{
    key: "Content-Type",
    value: "application/json",
    enabled: true
  }];
  body = "{\n" + "  \"foo\": \"bar\"\n" + "}";

  constructor(name) {
    if (name) this.name = name;
  }

}