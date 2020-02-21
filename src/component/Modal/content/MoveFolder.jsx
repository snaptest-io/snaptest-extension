import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'
import {walkThroughTreeNodes, walkUpAncestors} from '../../../util/treeUtils'
import {getOrgs, getProjects} from '../../../api'

class MoveFolder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      folderNode: props.modalMeta.nodeId,
      testId: props.modalMeta.testId,
      destination: props.localmode ? "personal" : "private",
      options: [],
      processing: false,
      success: false,
      error: null
    }

  }

  componentDidMount() {

    getOrgs(this.props.user.apikey).then((result) => {

      var orgs = result.orgs.items;
      var promises = orgs.map((org) => getProjects(this.props.user.apikey, org.id));

      Promise.all(promises).then((results) => {

        var options = [];

        orgs.forEach((org, orgIdx) => {

          options.push({name: org.name, id: org.id, type: "org"});

          var projects = results[orgIdx].projects.items;

          projects.filter((project) => !project.archived).forEach((project) => {
            options.push({name: org.name + " -> " + project.name, id: project.id, type: "project"});
          })

        });

        this.setState({options: options})

      });

    });
  }

  render() {
    
    const { user, localmode, tests} = this.props;
    const { folderNode, testId, destination, processing, success, error, options } = this.state;
    const folders = this.getFolders();

    return (
      <form className="modal-med-width grid-row grid-column move-folder-container" onSubmit={(e) => this.onSubmit(e)}>
        {!success ? (
        <div>
          <div className="grid-row v-align">
            <div className="h-label grid-item">
              Copy {`${testId ? "Test" : "Folder"}`}:
            </div>
            <div className="h-value grid-item-2">
              {folderNode && (
                <div className="select-wrap">
                  <select value={folderNode} onChange={(e) => this.setState({folderNode: e.currentTarget.value})} >
                    {folders.map((folder, idx) => (
                      <option idx={idx} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {testId && (
                <div>{this.getTestName(testId)}</div>
              )}
            </div>
          </div>
          <div className="grid-row v-align">
            <div className="h-label grid-item">
              To Account:
            </div>
            <div className="h-value grid-item-2">
              <div className="select-wrap">
                <select value={destination}
                        onChange={(e) => this.setState({destination: e.currentTarget.value})}>
                  <option value="private">Local mode</option>
                  <option value="personal">{user.email} (Personal)</option>
                  {options.map((option, idx) => (
                    <option key={idx} value={option.type + "|||" + option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="button-row button-group left-aligned">
            <button className="btn btn-primary" type="submit" disabled={processing}>{processing ? "Processing..." : `Submit`}</button>
            {!processing && (
              <button className="btn btn-secondary" type="button" onClick={() => this.onCancel()}>Cancel</button>
            )}
          </div>
          {error && (
            <div>{error}</div>
          )}
        </div>
        ) : (
          <div className="grid-row h-align v-align success-container">
            <h3>{folderNode ? "Folder" : "Test"} copied.</h3>
          </div>
        )}
      </form>
    )
  }

  onCancel() {
    Message.to(Message.SESSION, "setModal", null);
  }

  onSubmit(e) {

    e.preventDefault();

    const { options, destination, folderNode, testId } = this.state;
    const { user } = this.props;

    this.setState({processing: true, error: null, success: false});


    if (folderNode) {
      if (destination === "private") {
        Message.promise("copyFolderToAccount", {folderId: folderNode })
          .then(() => this.setState({processing: false, error: null, success: true}))
          .catch((e) => this.setState({processing: false, error: e, success: false}))
      } else if (destination === "personal") {
        Message
          .promise("copyFolderToAccount", {contextType: "user", contextId: "me", folderId: folderNode})
          .then(() => this.setState({processing: false, error: null, success: true}))
          .catch((e) => this.setState({processing: false, error: e, success: false}))
      } else {
        var parsedSelection = destination.split("|||");
        var destContext = _.find(options, {type: parsedSelection[0], id: parseInt(parsedSelection[1]) });
        Message
          .promise("copyFolderToAccount", {contextType: destContext.type, contextId: destContext.id, folderId: folderNode})
          .then(() => this.setState({processing: false, error: null, success: true}))
          .catch((e) => this.setState({processing: false, error: e, success: false}))
      }
    } else {
      if (destination === "private") {
        Message.promise("copyTestToAccount", {testId})
          .then(() => this.setState({processing: false, success: true}))
          .catch((e) => this.setState({processing: false, success: false, error: e}))
      } else if (destination === "personal") {
        Message.promise("copyTestToAccount", {testId, contextType: "user", contextId: "me"})
          .then(() => this.setState({processing: false, success: true}))
          .catch((e) => this.setState({processing: false, success: false, error: e}))
      } else {
        var parsedSelection = destination.split("|||");
        var destContext = _.find(options, {type: parsedSelection[0], id: parseInt(parsedSelection[1]) });
        Message.promise("copyTestToAccount", {testId, contextType: destContext.type, contextId: destContext.id})
          .then(() => this.setState({processing: false, success: true}))
          .catch((e) => this.setState({processing: false, success: false, error: e}))
      }
    }

  }

  getTestName(testId) {

    const { tests } = this.props;

    var test = _.find(tests, {id: testId});

    if (test) return test.name;
    else return "";
  }

  getFolders() {

    const { directory } = this.props;

    var folders = [];

    walkThroughTreeNodes(directory.tree, (node) => {
      if (!node.type && !node.topLevel && !node.testId) {

        var directories = node.module;

        walkUpAncestors(directory.tree, node.id, (node) => {
          if (node.module !== "tests" && !node.topLevel) directories = node.module + " -> " + directories;
        });

        folders.push({name: directories, id: node.id});

      }
    });

    return folders;

  }

}

export default MoveFolder;
