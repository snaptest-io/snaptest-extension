import Message from '../util/Message'

export function recordAction(action) {
    Message.toAll("addAction", action);
};