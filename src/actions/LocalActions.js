import deepClone from 'deep-clone'

chrome.storage.local.get(['localModeCache'], (data) => {
  if (data.localModeCache) {
    localModeCache = data.localModeCache;
  }
});

export function getDefaultCache() {
  return {tests: [],
    drafts: [],
    dataProfiles: [],
    components: [],
    runs: [],
    tags: [],
    testsInTagsMap: {},
    directory: {
      tree: {
        "module": "Tests",
        topLevel: true,
        showGen: true,
        "children": []
      }
    }
  }
};

var localModeCache = getDefaultCache();

export function saveEditedCache(cached) {
  chrome.storage.local.set({'localModeCache': cached});
  localModeCache = cached;
}

export function cacheLocalMode(state) {

  var cached = {
    tests: deepClone(state.tests),
    components: deepClone(state.components),
    directory: deepClone(state.directory),
    dataProfiles: deepClone(state.dataProfiles),
    runs: deepClone(state.runs),
    tags: deepClone(state.tags),
    testsInTagsMap: deepClone(state.testsInTagsMap),
    drafts: deepClone(state.drafts)
  };

  chrome.storage.local.set({'localModeCache': cached});
  localModeCache = cached;

}

export function getLocaCache() {
  return localModeCache;
}

export function flushCache() {
  chrome.storage.local.set({'localModeCache': getDefaultCache() });
  localModeCache = getDefaultCache();
};