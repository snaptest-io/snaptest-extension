export function getCurrentContextType(state) {
    return getCurrentContextInfo(state).type;
}

export function getCurrentContext(state) {
  return getCurrentContextInfo(state).context;
}

export function getCurrentContextInfo(state) {

  var base = {
    isProject: false,
    isOrg: false,
    isUser: false,
    isLocal: false
  };

  if (state.selectedProject) {
    return Object.assign(base, {
      type: "project",
      id: state.selectedProject.id,
      context: state.selectedProject,
      isProject: true
    });
  } else if (state.selectedOrg) {
    return Object.assign(base, {
      type: "org",
      id: state.selectedOrg.id,
      context: state.selectedOrg,
      isOrg: true
    })
  } else if (!state.localmode) {
    return Object.assign(base, {
      type: "user",
      id: "me",
      context: state.user,
      isUser: true
    })
  } else {
    return Object.assign(base, {
      type: "local",
      id: null,
      context: null,
      isLocal: true
    })
  }
}