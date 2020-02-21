import {saveInBatches, autoSave} from '../util/statePersistance';
import deepClone from 'deep-clone'
import {generate as generateId} from 'shortid'

export const copyEnvToAccount = (params, state) => {

  const { envId, contextType, contextId } = params;

  var env = _.find(state.dataProfiles, {profileId: envId});

  var copiedEnv = deepClone(env);
  var newId = copiedEnv.profileId = generateId();
  copiedEnv.id = newId;
  copiedEnv.profileId = newId;

  return saveInBatches(state.user.apikey, contextType, contextId, [{...copiedEnv, type: "dataProfile"}]);

};

export const updateEnv = (params, state) => {

  const { updatedProfile } = params;

  var profileIdx = _.findIndex(state.dataProfiles, {profileId: updatedProfile.profileId});

  if (profileIdx > -1) {
    state.dataProfiles.splice(profileIdx, 1, updatedProfile);
    autoSave({...updatedProfile, type: "dataProfile"}, state, true);
  }

};