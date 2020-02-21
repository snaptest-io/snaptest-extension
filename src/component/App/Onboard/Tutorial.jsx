import React from 'react'
import classnames from 'classnames'
import Message from '../../../util/Message.js'
import * as Tut from '../../../models/tutconsts';


class Tutorial extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { tutorialStep } = this.props;

    if (tutorialStep === Tut.INTRO_START || tutorialStep === Tut.INTRO_WINDOWS) {

      return (
        <div className="modal-background">
          <div className="modal-content grid-row v-align h-align t-center" onClick={(e) => e.stopPropagation() }>
            {tutorialStep === Tut.INTRO_START ? (
              <div className="grid-item padded-modal">
                <h1>Getting started...</h1>
                <p className="button-group">
                  <button className="btn recording-btn" onClick={() => this.onTutorialStart()}>+ Begin Tutorial</button>
                </p>
                <a onClick={() => this.onTutorialSkip()}>Nevermind...</a>
              </div>
            ) : (
              <div className="grid-item padded-modal">
                <h4>Before we begin, organize your windows like this:</h4>
              <div>(Note the ACTIVE TAB)</div>
                <img className="screen_layout_sug" src={chrome.extension.getURL("assets/screen_layout_suggestion.png")} />
                <a className="next-step-prompt" onClick={(e) => this.goToNextStep()}>I've configured my windows.</a>
              </div>
            )}
          </div>
        </div>
      )
    } else {
      return (
        <div className="modal-background tut-mode">
          <div className="modal-content modal-med grid-row">
            <button className="prev-tut-btn" onClick={() => this.goToPrevStep()}>last</button>
            <div className="grid-item grid-row grid-column">
              {tutorialStep === Tut.FIRSTTEST_CREATE ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h3>Let's <span className="t-underline">create</span> your first test.</h3>
                  <h4>Click on the <button className="btn recording-btn">+ new test</button> button.</h4>
                </div>
              ) : tutorialStep === Tut.FIRSTTEST_EDIT ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h4>Enter the test by clicking on it.</h4>
                </div>
              ) : tutorialStep === Tut.FIRSTTEST_PRETHOUGHT ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h3>When doing QA tests...</h3>
                  <h4 className="tut-content-section">You are testing a user flow through a site or web application.</h4>
                  <h4 className="tut-content-section">It's important to put yourself into the mindset of a user... </h4>
                  <a onClick={() => this.goToNextStep() }>Got it...</a>
                </div>
              ) : tutorialStep === Tut.FIRSTTEST_NAVTOSNAP ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h5>For this tutorial, let's test as a new user of SnapTests marketing site...</h5>
                  <h4>Navigate the active chrome window to snaptest.io</h4>
                </div>
              ) : tutorialStep === Tut.FIRSTTEST_PRETEND ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h4>Enter<button className="btn recording-btn">record</button> mode and start to record some actions in the active chrome tab.</h4>
                </div>
              ) : tutorialStep === Tut.FIRSTTEST_STOPRECORD ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h4>When you're done, hit <button className="btn recording-btn active">record</button> to stop recording.</h4>
                </div>
              ) : tutorialStep === Tut.FIRSTTEST_ASSERT ? (
                  <div className="grid-item grid-row v-align h-align grid-column tut-content">
                    <h6>Let's assert some elements. Enter <button className="btn assert-btn">assert</button> mode.</h6>
                    <h5>Click around in the active tab, and notice that SnapTest will generate assertions for you.</h5>
                  </div>
              ) : tutorialStep === Tut.FIRSTTEST_STOPASSERT ? (
                  <div className="grid-item grid-row v-align h-align grid-column tut-content">
                    <h4>When you're done exit by clicking <button className="btn assert-btn active">assert</button>.</h4>
                  </div>
              ) : tutorialStep === Tut.FIRSTTEST_SIMULATE ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h4>Let's run this test by clicking <button className="btn btn-primary play-btn">play</button>. </h4>
                  <h5>This will emulate the generated Selenium code with high accuracy, so it's useful for debugging. </h5>
                </div>
              ) : tutorialStep === Tut.FIRSTTEST_SIMULATE2 ? (
                  <div className="grid-item grid-row v-align h-align grid-column tut-content">
                      <h3>Try adding breakpoints <img className="tut-img-openaction" src={chrome.extension.getURL("assets/breakpoint2.png")}/> and use the <button className="btn play-btns">step over</button> function. </h3>
                  </div>
              ) : tutorialStep === Tut.FIRSTTEST_NAMESTEP ? (
                  <div className="grid-item grid-row v-align h-align grid-column tut-content">
                    <h6>After recording, it's a good idea to give your steps more human readable descriptions. </h6>
                    <h5 className="tut-content-section grid-row v-align">Open a step with <img className="tut-img-openaction" src={chrome.extension.getURL("assets/openaction.png")}/>.</h5>
                    <h6 className="tut-content-section">Give it a good description from the perspective of a user, like: "clicked on the blog button in the main menu".</h6>
                  </div>
              ) : tutorialStep === Tut.FIRSTTEST_ADJUSTSELECTOR ? (
                  <div className="grid-item grid-row v-align h-align grid-column tut-content">
                    <h6>Sometimes you need to add/change the way SnapTest finds the element (the selector).</h6>
                    <h5 className="tut-content-section">Click on a step's <img className="selection-icon" src={chrome.extension.getURL("assets/target.png")}/> icon.</h5>
                    <h6 className="tut-content-section">It will change to <img className="tut-img-openaction" src={chrome.extension.getURL("assets/selectormode.png")}/> which indicates quick selector mode. Find and click desired target element in active tab. </h6>
                  </div>
              ) : tutorialStep === Tut.FIRSTTEST_MANUALADD ? (
                  <div className="grid-item grid-row v-align h-align grid-column tut-content">
                    <h5>Manually adding steps is easy... click: </h5>
                    <img className="tut-img-openaction" src={chrome.extension.getURL("assets/manual_add.png")}/>
                    <h4 className="tut-content-section">Try adding an action manually, maybe a 'pause' step...</h4>
                  </div>
              ) : tutorialStep === Tut.FIRSTTEST_MANAGE ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h4>Let's go back to the dashboard and organize the new test.</h4>
                  <h5 className="tut-content-section">Click on <a>Back to "Dashboard"</a> in the top-left to get back to your tests.</h5>
                </div>
              ) : tutorialStep === Tut.FIRSTTEST_MANAGE2 ? (
                  <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h3 className="tut-content-section">Rename your test from "Unnamed test" to something like "new user walkthrough".</h3>
                  </div>
              ) : tutorialStep === Tut.FIRSTTEST_MANAGE3 ? (
                  <div className="grid-item grid-row v-align h-align grid-column tut-content">
                    <h5 className="tut-content-section">We've created some folders for you.</h5>
                    <h4 className="tut-content-section">Drag your new test into the "Your project -> production" folder.</h4>
                    <h5 className="tut-content-section">There is no magical folder structure. Feel free to configure it as you like. </h5>
                  </div>
              ) : tutorialStep === Tut.EXISTTEST_KICKOFF ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h4>Try running some example tests from the dashboard</h4>
                  <h5 className="tut-content-section">We've provided a 'Sample Tests' folder, feel free to run any of them with the <button className="btn btn-primary play-btn">play</button> button.</h5>
                </div>
              ) : tutorialStep === Tut.END ? (
                <div className="grid-item grid-row v-align h-align grid-column tut-content">
                  <h3>That's a basic walkthrough of creating and emulating tests, but that's only half of it...</h3>
                  <h5 className="tut-content-section"><a href="https://www.snaptest.io/doc/overview" target="_blank">Visit official docs. </a></h5>
                  {/*<a onClick={() => this.onTutorialSkip()}>Finish tutorial</a>*/}
                </div>
              ) : null }
              <div className="stop-tutorial grid-row h-align" >
                <a onClick={() => this.onTutorialSkip()}>Stop Tutorial</a>
              </div>
            </div>
            <button className="next-tut-btn" onClick={() => this.goToNextStep()}>next</button>
          </div>
        </div>
      )
    }

  }

  goToNextStep() {
    const { tutorialStepNumber } = this.props;
    Message.to(Message.SESSION, "setTutStep", tutorialStepNumber + 1);
  }

  goToPrevStep() {
    const { tutorialStepNumber } = this.props;
    Message.to(Message.SESSION, "setTutStep", tutorialStepNumber - 1);
  }

  onTutorialStart() {
    Message.to(Message.SESSION, "setTutStep", 1);
  }

  onTutorialSkip() {
    Message.to(Message.SESSION, "setTutActive", false);
  }

}


export default Tutorial;
