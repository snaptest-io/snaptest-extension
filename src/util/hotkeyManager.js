import Message from './Message'
import Mousetrap from 'mousetrap'
import Test from '../models/Test'
import Route from '../models/Route'

export function bindHotkeys() {

  // Mousetrap.bind(this.state.hotkeyConfig.TOGGLE_VIEW_HOTKEYS, () => {
  //   Message.to(Message.SESSION, "setShowHotkeys", !this.state.showHotkeys )
  // });

  Mousetrap.bind(this.state.hotkeyConfig.DELETE_ROWS, () => {
    Message.to(Message.SESSION, "removeNWActions");
    Message.to(Message.SESSION, "clearSelectedRows");
  });

  Mousetrap.bind(this.state.hotkeyConfig.START_PLAYBACK, () => {
    Message.promise("startActiveTestPlayback");
  });

  Mousetrap.bind(this.state.hotkeyConfig.ESCAPE, () => {
    Message.to(Message.SESSION, "setModal", null);
  });

  Mousetrap.bind(this.state.hotkeyConfig.UNDO, () => {
    Message.to(Message.SESSION, "undo");
  });

  Mousetrap.bind(this.state.hotkeyConfig.REDO, () => {
    Message.to(Message.SESSION, "redo");
  });

  Mousetrap.bind(this.state.hotkeyConfig.CLEAR_SELECTION, () => {
    Message.to(Message.SESSION, "clearSelectedRows");
  });

  Mousetrap.bind(this.state.hotkeyConfig.ROLLUP_SELECTION, () => {
    Message.to(Message.SESSION, "createComponentFromSelectedRows")
  });

  Mousetrap.bind(this.state.hotkeyConfig.BACK, () => { Message.to(Message.SESSION, "backRoute" ) });

  Mousetrap.bind(this.state.hotkeyConfig.ASSERT_MODE, () => {
    var route = this.state.viewStack[this.state.viewStack.length - 1].name;
    if (route === "testbuilder" || route === "componentbuilder") {
      if(this.state.isAssertMode) {
        Message.promise("stopAsserting" );
      } else {
        Message.promise("startAsserting");
      }
    }
  });

  Mousetrap.bind(this.state.hotkeyConfig.RECORD_MODE, () => {
    var route = this.state.viewStack[this.state.viewStack.length - 1].name;
    if (route === "testbuilder" || route === "componentbuilder") {
      if(this.state.isRecording) {
        Message.promise("stopRecording" );
      } else {
        Message.promise("startRecording");
      }
    }
  });

  Mousetrap.bind(this.state.hotkeyConfig.CANCEL_MODE, () => {
    Message.promise("stopAsserting");
    Message.promise("stopRecording" );
  });

  Mousetrap.bind(this.state.hotkeyConfig.NEW_TEST, () => {
    var route = this.state.viewStack[this.state.viewStack.length - 1].name;
    if (route === "dashboard") {
      var newTest = new Test();
      Message.to(Message.SESSION, "addNewTest", newTest);
      Message.to(Message.SESSION, "setTestActive", newTest.id);
      Message.to(Message.SESSION, "pushRoute", new Route("testbuilder", { testId: newTest.id } ) );
      Message.to(Message.SESSION, "startRecording", {
        initialUrl: window.location.href,
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  });

}

export function unbindHotkeys() {

}