export function getAccountType(state) {
  return state.localmode ? "local" : state.selectedOrg ? "org" : "user";
}