import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'

class CreateTag extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      editingTag: null
    }

  }

  componentDidMount() {

    const { editingTag, tags = []} = this.props;

    this.refs.name.focus();

    if (editingTag && _.find(tags, {id: editingTag})) {

      var tag = _.find(tags, {id: editingTag});

      this.setState({
        editingTag: tag,
        name: tag.name,
      })

    }
  }

  render() {

    const { onClose = _.noop} = this.props;
    const { editingTag, error, name } = this.state;

    return (
      <div className="create-data-profile">
        <form className="form grid-row grid-column" onSubmit={(e) => { e.preventDefault(); }}>
          {editingTag ? (
            <h6 className="title">Edit Tag:</h6>
          ) : (
            <h6 className="title">New Tag:</h6>
          )}
          <div className="grid-row">
            <div className="h-label grid-item grid-row v-align ">Name: </div>
            <div className="h-value grid-item-2">
              <input ref="name"
                     type="text"
                     className="text-input"
                     placeholder={`e.g. prod smoke, staging build tests`}
                     value={name}
                     onChange={(e) => this.setState({name: e.currentTarget.value})}/>
            </div>
          </div>
          {error && (
            <div className="grid-row error-message">
              {error}
            </div>
          )}
          <div className="grid-row button-row">
            <div className="grid-row button-group left-aligned">
              {editingTag ? (
                <button className="btn btn-primary"
                        onClick={() => this.onSubmit() }>Save</button>
              ) : (
                <button className="btn btn-primary"
                        onClick={() => this.onSubmit() }>Add Tag</button>
              )}
              <button className="btn btn-secondary"
                      type="button"
                      onClick={() => onClose() }>Cancel</button>
            </div>
            <div className="grid-item"></div>
            <div className="grid-row button-group">
              {editingTag && (
                <button className="btn btn-delete"
                        type="submit"
                        onClick={() => this.onDelete() }>Delete</button>
              )}
            </div>
          </div>
        </form>
      </div>
    )
  }

  onDelete() {
    const { editingTag } = this.state;
    const { onClose } = this.props;
    Message.promise("deleteTag", {id: editingTag.id}).then(() => onClose());
  }

  onSubmit() {

    const { onClose } = this.props;
    const { name, editingTag } = this.state;

    if (!name) {
      this.setState({error: "Please add a name."});
    } else {

      if (!editingTag) {
        Message.promise("createTag", {
          name
        });

      } else {
        Message.promise("updateTag", {
          id: editingTag.id,
          name
        });
      }

      onClose();

    }
  }

}

export default CreateTag;
