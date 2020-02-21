import {dataURItoBlob} from "../../util/util";

var executeScript = (code, tabId) => new Promise((resolve, reject) => {
  chrome.tabs.executeScript(tabId, {code}, (result, error) => {
    if (typeof result === "undefined") return resolve({success: false});
    else if (error) return reject(error);
    else return resolve(...result);
  });
});

function createCanvas (width, height, pixelRatio = 1) {
  const canvas = document.createElement('canvas');
  canvas.width  = width * pixelRatio;
  canvas.height = height * pixelRatio;
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
    executeScript("window.hideSnapUI()", tabId)
      .then(() => executeScript("window.getPageInfo()", tabId)
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
          return executeScript(`window.triggerScrollWindow({x: ${offset.x}, y: ${offset.y}})`, tabId)
            .then(() => pauseTime(50))
            .then(() =>  executeScript("window.getOffsets()", tabId))
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
    .then(() => executeScript("window.showSnapUI()", tabId))
  })
};

function pSeries (list) {
  return list.reduce((prev, fn) => {
    return prev.then(fn)
  }, Promise.resolve())
}
