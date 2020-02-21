import _ from 'lodash'

export const showTestFilters = (params, state) => {
  state.showTestFilters = true;
};

export const hideTestFilters = (params, state) => {
  state.showTestFilters = false;
};

export const toggleTestFilters = (params, state) => {
  state.showTestFilters = !state.showTestFilters;
};

export const addTagTestFilter = (params, state) => {
  const { tagId } = params;
  state.tagTestFilters.push(tagId);
};


export const removeTagTestFilter = (params, state) => {
  const { tagId } = params;
  state.tagTestFilters = state.tagTestFilters.filter((filter) => filter !== tagId)

};

export const toggleTagTestFilter = (params, state) => {
  const { tagId } = params;

  var hasEntry = state.tagTestFilters.filter((filter) => filter === tagId).length > 0;

  if (hasEntry) {
    state.tagTestFilters = state.tagTestFilters.filter((filter) => filter !== tagId)
  } else {
    state.tagTestFilters.push(tagId);
  }

};

export const clearTestFilters = (params, state) => {
  state.tagTestFilters = [];
};

export const toggleTestFilterOperator = (params, state) => {
  state.testFilterOperator = state.testFilterOperator === "AND" ? "OR" : "AND";
};

