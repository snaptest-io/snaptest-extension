import _ from 'lodash'
var cache = [];

export const saveScreenshot = (uri, uuid) => {
  return new Promise((resolve, reject) => {
    cache.push({ uuid, uri });
    resolve();
  })
};

export const getScreenshots = () => {
  return cache;
};

export const clearScreenshotCache = () => {
  return new Promise((resolve, reject) => {
    cache = [];
    resolve();
  })
};

export const flagScreenshotsForDeletion = (uuids) => {
  setTimeout(() => {
    uuids.forEach((uuid) => {
      var existingImageIdx = _.findIndex(cache, {uuid});
      if (existingImageIdx !== -1) {
        uuids.splice(existingImageIdx, 1);
      }
    })
  }, 25000)
};
