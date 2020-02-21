export const hasResultFiltersApplied = (resultFilters) => {

  if (!resultFilters) return false;

  if (resultFilters.combos && resultFilters.combos.length > 0) return true;
  if (resultFilters.runIds && resultFilters.runIds.length > 0) return true;
  if (resultFilters.projectIds && resultFilters.projectIds.length > 0) return true;
  if (resultFilters.runnerIds && resultFilters.runnerIds.length > 0) return true;
  if (resultFilters.applyTimeFilter) return true;

  return false;

};