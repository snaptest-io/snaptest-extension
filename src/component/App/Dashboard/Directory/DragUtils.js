import Message from '../../../../util/Message'

export function endDrag(props, monitor) {

  const dropResult = monitor.getDropResult();

  if (dropResult) {

    var source = props.node.id;
    var dest = dropResult.nodeId;
    var location = dropResult.location;

    if (source && dest && location) {
      Message.to(Message.SESSION, "directoryMove", {source, dest, location});
    }

  }

}
