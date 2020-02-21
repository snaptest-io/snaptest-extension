import _ from 'lodash'
import axios from 'axios'

export function uploadScreenshots(apikey, ownerType, ownerId, screenshots, resultId, MAX_SS_UPLOAD_COUNT = 3, onProgress = _.noop, onComplete = _.noop) {

  // Split screenshots into 5's...

  var looper = 0;
  var chunkIdx = -1;
  var chunks = [];

  screenshots.forEach((screenshot) => {
    if (chunks.length === 0 || looper === MAX_SS_UPLOAD_COUNT) {
      looper = 0;
      chunkIdx++;
      chunks[chunkIdx] = [screenshot]
    } else {
      chunks[chunkIdx].push(screenshot);
    }
    looper++;
  });

  var promises = chunks.map((chunkScreenshots) => {

    let form = new FormData();

    chunkScreenshots.forEach((chunkScreenshot) => {
      form.append('screenshots', chunkScreenshot.blob);
      form.append('uuids', chunkScreenshot.uuid);
      form.append('names', chunkScreenshot.name);
    });

    return axios({
      method: 'post',
      url: `${API_URL}/${ownerType}/${ownerId}/result/${resultId}/screenshot`,
      data: form,
      onUploadProgress: function (progressEvent) {
        onProgress(progressEvent.loaded / progressEvent.total)
      },
      headers: {"X-Requested-With": "XMLHttpRequest", "apikey": apikey}
    });

  });

  // execute in series.
  return promises.reduce((promiseChain, currentTask) => {
    return promiseChain.then(chainResults =>
      currentTask.then(currentResult => [ ...chainResults, currentResult ])
    );
  }, Promise.resolve([])).then((results) => {
    onComplete();
  })

}
