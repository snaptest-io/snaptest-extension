import deepClone from 'deep-clone'

var cache = {
  org: {},
  project: {},
  user: {
    drafts: []
  },
  local: {
    drafts: []
  }
};

export const switchDraftContexts = (newOwnerType, newOwnerId, state) => {

  const { contextType, contextId, localmode } = state;

  // cache current drafts appropriately.
  if (contextType === "project" || contextType === "org") {
    cache[contextType][contextId] = { drafts: deepClone(state.drafts) };
  } else {
    cache[localmode ? "local" : "user"].drafts = deepClone(state.drafts);
  }

  // hydrate current drafts with cached.
  if (newOwnerType === "project" || newOwnerType === "org") {
    if (cache[newOwnerType][newOwnerId]) {
      state.drafts = cache[newOwnerType][newOwnerId].drafts || [];
    } else {
      state.drafts = [];
    }
  } else {
    state.drafts = cache[newOwnerType].drafts || [];
  }

};