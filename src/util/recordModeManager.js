var cachedIsRecording;

export function recordModeManager(isRecording) {

  // if no change to record mode, get out!
  if (isRecording === cachedIsRecording) {
    return;
  } else {
    cachedIsRecording = isRecording;
  }

  if (isRecording) {
    document.body.classList.add("snpr");
  } else {
    document.body.classList.remove("snpr");
  }

}