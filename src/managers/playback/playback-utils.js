import {dataURItoBlob} from "../../util/util";

function executeFunction(name, params) {
  if (typeof window[name] !== 'undefined') {
    const result = window[name](params)
    console.log(result)
    return result
  } else {
    console.log("none")
    return {success: false}
  }
}

var executeScript2 = (tabId, playbackFnName, playbackFnParams) => new Promise((resolve, reject) => {
  chrome.scripting.executeScript({
    target: {
      tabId
    },
    func: executeFunction,
    args : [ playbackFnName, playbackFnParams || {} ]
  }, (results, error) => {
    const result = results[0]

    if (typeof result === "undefined") return resolve({success: false});
    else if (error) return reject(error);
    else return resolve(result.result);
  });
});
// var executeScript = (code, tabId) => new Promise((resolve, reject) => {
//   chrome.tabs.executeScript(tabId, {code}, (result, error) => {
//     if (typeof result === "undefined") return resolve({success: false});
//     else if (error) return reject(error);
//     else return resolve(...result);
//   });
// });

function createCanvas (width, height, pixelRatio = 1) {
  const canvas = new OffscreenCanvas(width * pixelRatio, height * pixelRatio);

  // const canvas = document.createElement('canvas');
  // canvas.width  = width * pixelRatio;
  // canvas.height = height * pixelRatio;
  return canvas
}

function drawOnCanvas ({ canvas, dataURI, x, y, width, height }) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height, x, y, width || image.width, height || image.height)
      resolve({
        x,
        y,
        width,
        height
      })
    };

    image.src = dataURI
  })
}

function getAllScrollOffsets ({ pageWidth, pageHeight, windowWidth, windowHeight, topPadding = 150 }) {
  const topPad  = windowHeight > topPadding ? topPadding : 0;
  const xStep   = windowWidth;
  const yStep   = windowHeight - topPad;
  const result  = [];

  for (let y = pageHeight - windowHeight; y > -1 * yStep; y -= yStep) {
    for (let x = 0; x < pageWidth; x += xStep) {
      result.push({ x, y })
    }
  }

  return result
}

var pauseTime = (duration) =>
  new Promise((resolve, reject) => setTimeout(() => resolve({success: true}), duration));

export const pause = (duration) => {
  new Promise((resolve) => setTimeout(() => resolve(), duration));
}

export const partialScreenshot = (windowId) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(windowId, { format: 'jpeg', quality: 65 }, (dataURI, error) => {
      resolve(dataURI);
    })
  });
}

export const fullScreenshot = (windowId, tabId) => {
  return new Promise((resolve, reject) => {
    // executeScript("window.hideSnapUI()", tabId)
    executeScript2(tabId, 'hideSnapUI')
    //   .then(() => executeScript("window.getPageInfo()", tabId)
      .then(() => executeScript2(tabId, 'getPageInfo')
      .then((result) => {

        if (!result || !result.success) return reject("Couldn't take screenshot.");

        const pageInfo = result.data;
        const devicePixelRatio = pageInfo.devicePixelRatio;
        const maxSide       = Math.floor(32767 / devicePixelRatio);
        pageInfo.pageWidth  = Math.min(maxSide, pageInfo.pageWidth);
        pageInfo.pageHeight = Math.min(maxSide, pageInfo.pageHeight);
        const scrollOffsets = getAllScrollOffsets(pageInfo);
        var canvas = createCanvas(pageInfo.pageWidth, pageInfo.pageHeight, devicePixelRatio);

        var promises = scrollOffsets.map((offset) => () => {
          // return executeScript(`window.triggerScrollWindow({x: ${offset.x}, y: ${offset.y}})`, tabId)
          return executeScript2(tabId, 'triggerScrollWindow', {offset})
            .then(() => pauseTime(575)) // Can't be lower than 500 due to MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND
            // .then(() =>  executeScript("window.getOffsets()", tabId))
            .then(() =>  executeScript2(tabId, 'getOffsets'))
            .then((realOffsets) => {

              if (!realOffsets) return;

              return partialScreenshot(windowId)
                .then(dataURI => drawOnCanvas({
                  canvas,
                  dataURI,
                  x:      realOffsets.x * devicePixelRatio,
                  y:      realOffsets.y * devicePixelRatio,
                  width:  pageInfo.windowWidth * devicePixelRatio,
                  height: pageInfo.windowHeight * devicePixelRatio
                }))
            })
        });

        return pSeries(promises).then(() => {resolve(canvas.toDataURL());});

      }))
    .then(() => executeScript2(tabId, 'showSnapUI'))
    resolve()
  })
};

function pSeries (list) {
  return list.reduce((prev, fn) => {
    return prev.then(fn)
  }, Promise.resolve())
}
