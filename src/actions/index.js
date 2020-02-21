import Message from '../util/Message'
import * as UserActions from './UserActions';
import * as TestActions from './TestActions';
import * as OrgActions from './OrgActions';
import * as ProjectActions from './ProjectActions';
import * as ProjectGroupActions from './ProjectGroupActions';
import * as SettingsActions from './SettingsActions';
import * as RunActions from './RunActions';
import * as TagActions from './TagActions';
import * as EnvActions from './EnvActions';
import * as PlaybackActions from './PlaybackActions';
import * as ResultActions from './ResultActions';
import * as RouteActions from './RouteActions';
import * as ModeActions from './ModeActions';
import * as TestFilterActions from './TestFilterActions';
import * as ResultFilterActions from './ResultFilterActions';
import * as ExportActions from './ExportActions';

var actions = {
  ...UserActions,
  ...TestActions,
  ...TestFilterActions,
  ...OrgActions,
  ...ProjectActions,
  ...ProjectGroupActions,
  ...SettingsActions,
  ...RunActions,
  ...TagActions,
  ...EnvActions,
  ...PlaybackActions,
  ...ResultActions,
  ...ResultFilterActions,
  ...RouteActions,
  ...ModeActions,
  ...ExportActions
};

export function processAction(message, state, sendResponse) {

  var actionPromise = actions[message.action](message.payload, state);

  Promise.resolve(actionPromise).then((result) => {
    Message.toAll( "stateChange", {...state, cause: message.action });
    sendResponse({success: true, payload: result});
  }).catch((e) => {
    Message.toAll( "stateChange", {...state, cause: message.action });
    sendResponse({success: false, payload: (e instanceof Error) ? e.message : e});
  });

  return true;

}