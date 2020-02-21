import React from 'react'
import {DashboardHelp, ComponentHelp, Support, Import, Export, CustomRepeat, CustomDelay, CreateDataProfile, CreateRun, CreateTag, MoveFolder, DeleteFolder, AddProject, ArchiveProject, ViewResultsModal, AddProjectGroup} from './content/'
import Message from '../../util/Message.js'
import classNames from 'classnames'

class Modal extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { modal } = this.props;

    if (!modal) return null;

    const modalContentClasses = classNames({
      "modal-content": true,
      "grid-row": true,
      "modal-full-screen": (modal === "view-results"),
      "modal-full-width": (modal === "create-data-profile" || modal === "create-run" || modal === "create-tag")
    });

    const showCloseButton = !(
      modal === "custom-repeat" ||
      modal === "move-folder" ||
      modal === "custom-delay" ||
      modal === "add-project" ||
      modal === "add-project-group" ||
      modal === "view-results" ||
      modal === "archive-project" ||
      modal === "create-data-profile" ||
      modal === "create-run" ||
      modal === "create-tag" ||
      modal === "edit-run");

    return (
      <div className="modal-background" onMouseDown={() => this.closeModal()}>
        <div className={modalContentClasses} onMouseDown={(e) => e.stopPropagation()}>
          {showCloseButton && (
            <button className="btn btn-primary close-modal" onClick={(e) => this.closeModal()}>Close</button>
          )}
          {modal === "dashboard-help" ? (
            <DashboardHelp />
          ) : modal === "import" ? (
            <Import closeModal={() => this.closeModal() } />
          ) : modal === "export" ? (
            <Export {...this.props} closeModal={() => this.closeModal() } />
          ) : modal === "component-help" ? (
            <ComponentHelp />
          ) : modal === "support" ? (
            <Support />
          ) : modal === "custom-repeat" ? (
            <CustomRepeat onClose={() => this.closeModal()} />
          ) : modal === "custom-delay" ? (
            <CustomDelay onClose={() => this.closeModal()} />
          ) : modal === "create-data-profile" ? (
            <CreateDataProfile {...this.props} onClose={() => this.closeModal()} />
          ) : modal === "create-run" ? (
            <CreateRun {...this.props} onClose={() => this.closeModal()} />
          ) : modal === "create-tag" ? (
            <CreateTag {...this.props} onClose={() => this.closeModal()} />
          ) : modal === "move-folder" ? (
            <MoveFolder {...this.props} onClose={() => this.closeModal()} />
          ) : modal === "delete-folder" ? (
            <DeleteFolder {...this.props} onClose={() => this.closeModal()} />
          ) : modal === "add-project" ? (
            <AddProject {...this.props} onClose={() => this.closeModal()} />
          ) : modal === "add-project-group" ? (
            <AddProjectGroup {...this.props} onClose={() => this.closeModal()} />
          ) : modal === "archive-project" ? (
            <ArchiveProject {...this.props} onClose={() => this.closeModal()} />
          ) : modal === "view-results" ? (
            <ViewResultsModal {...this.props} onClose={() => this.closeModal()} />
          ) : null}
        </div>
      </div>
    )
  }

  closeModal() {
    Message.to(Message.SESSION, "setModal", null);
  }

}

export default Modal;
