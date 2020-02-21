import React from 'react'
import Message from '../../../util/Message.js'
import {walkThroughTreeNodes, walkUpAncestors} from '../../../util/treeUtils'

class DeleteFolder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      folderNode: props.modalMeta.nodeId,
      processing: false,
      success: false,
      error: null
    }

  }

  render() {

    const { folderNode, processing, success, error } = this.state;
    const folders = this.getFolders();

    return (
      <form className="modal-med-width grid-row grid-column" onSubmit={(e) => this.onSubmit(e)}>
        <h5 className="modal-title2">Archive Folder</h5>
        {!success ? (
        <div>
          <div className="grid-row v-align">
            <div className="h-label grid-item">
              Archive Folder:
            </div>
            <div className="h-value grid-item-2">
              <div className="select-wrap">
                <select value={folderNode} onChange={(e) => this.setState({folderNode: e.currentTarget.value})} >
                  {folders.map((folder, idx) => (
                    <option idx={idx} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="button-row button-group left-aligned">
            <button className="btn btn-delete" type="submit" disabled={processing}>{processing ? "Processing..." : "Archive Folder"}</button>
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
            <h3>Folder Archived!</h3>
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

    if (confirm("Please confirm deletion of this folder.")) {

      this.setState({processing: true, error: null, success: false});

      Message.promise("deleteFolder", {folderId: this.state.folderNode})
        .then(() => this.setState({processing: false, error: null, success: true}))
        .catch((e) => this.setState({processing: false, error: e, success: false}))

    }
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

export default DeleteFolder;
