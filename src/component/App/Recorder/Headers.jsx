import React from 'react'
import _ from 'lodash'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import {SweetTextInput} from '../../../component'

class Headers extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const headers = this.props.headers.concat([{key: "", value: "", enabled: true, ephemeral: true}]);

    return (
      <div className="req-headers">
        <div className="req-header-row top-row">
          <div className="req-header-handle invis">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 6C6.67 6 6 6.67 6 7.5S6.67 9 7.5 9 9 8.33 9 7.5 8.33 6 7.5 6zm0 5c-.83 0-1.5.67-1.5 1.5S6.67 14 7.5 14 9 13.33 9 12.5 8.33 11 7.5 11zm0 5c-.83 0-1.5.67-1.5 1.5S6.67 19 7.5 19 9 18.33 9 17.5 8.33 16 7.5 16zm5-12c.83 0 1.5-.67 1.5-1.5S13.33 1 12.5 1 11 1.67 11 2.5 11.67 4 12.5 4zm-5-3C6.67 1 6 1.67 6 2.5S6.67 4 7.5 4 9 3.33 9 2.5 8.33 1 7.5 1zm5 10c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-10c-.83 0-1.5.67-1.5 1.5S11.67 9 12.5 9 14 8.33 14 7.5 13.33 6 12.5 6z" id="drag_handle_vertical_5_"/></svg>
          </div>
          <div className="req-header-key">
            <div className="req-input">KEY</div>
          </div>
          <div className="req-header-value">
            <div className="req-input">VALUE</div>
          </div>
          <div className="req-remove invis">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71 0-.55-.45-1-1-1-.28 0-.53.11-.71.29L10 8.59l-4.29-4.3C5.53 4.11 5.28 4 5 4c-.55 0-1 .45-1 1 0 .28.11.53.29.71L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71 0 .55.45 1 1 1 .28 0 .53-.11.71-.29l4.29-4.3 4.29 4.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71L11.41 10z" id="cross_mark_6_"/></svg>
          </div>
        </div>
        <SortableList items={headers}
                      onSortEnd={(e) => this.onSort(arrayMove(headers, e.oldIndex, e.newIndex))}
                      useDragHandle={true}
                      lockAxis="y"
                      onChange={(idx, changedHeader) => this.onChange(idx, changedHeader)}
                      onAdd={(header) => this.onAdd(header)}/>
      </div>
    )
  }

  onAdd(header) {
    const { onChange = _.noop, headers } = this.props;
    delete header.ephemeral;
    headers.push(header);
    onChange(headers);
  }

  onSort(headers) {
    const { onChange = _.noop } = this.props;
    onChange(headers.filter((header) => !header.ephemeral));
  }

  onChange(idx, header) {

    const { onChange = _.noop, headers } = this.props;

    if (!header) {
      // delete case
      headers.splice(idx, 1);
    }
    else {
      // update case
      delete header.ephemeral;
      headers[idx] = header;
    }

    onChange(headers);

  }

}

const DragHandle = SortableHandle(() =>
  <div className="req-header-handle">
    <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 6C6.67 6 6 6.67 6 7.5S6.67 9 7.5 9 9 8.33 9 7.5 8.33 6 7.5 6zm0 5c-.83 0-1.5.67-1.5 1.5S6.67 14 7.5 14 9 13.33 9 12.5 8.33 11 7.5 11zm0 5c-.83 0-1.5.67-1.5 1.5S6.67 19 7.5 19 9 18.33 9 17.5 8.33 16 7.5 16zm5-12c.83 0 1.5-.67 1.5-1.5S13.33 1 12.5 1 11 1.67 11 2.5 11.67 4 12.5 4zm-5-3C6.67 1 6 1.67 6 2.5S6.67 4 7.5 4 9 3.33 9 2.5 8.33 1 7.5 1zm5 10c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-10c-.83 0-1.5.67-1.5 1.5S11.67 9 12.5 9 14 8.33 14 7.5 13.33 6 12.5 6z" id="drag_handle_vertical_5_"/></svg>
  </div>
);

const SortableItem = SortableElement(({header, idx, onChange }) => {
  return (
    <div className="req-header-row">
      <DragHandle />
      <div className="req-header-key">
        <SweetTextInput value={header.key}
                        triggerOnFirstEdit
                        triggerEvent="change"
                        triggerDebounce={50}
                        className="req-input"
                        index={idx}
                        onChange={(key) => onChange(idx, {...header, key})} />
      </div>
      <div className="req-header-value">
        <SweetTextInput value={header.value}
                        triggerOnFirstEdit
                        triggerEvent="change"
                        triggerDebounce={50}
                        className="req-input"
                        index={idx}
                        onChange={(value) => onChange(idx, {...header, value})} />
      </div>
      <div className="req-remove" onClick={() => onChange(idx)}>
        <svg viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71 0-.55-.45-1-1-1-.28 0-.53.11-.71.29L10 8.59l-4.29-4.3C5.53 4.11 5.28 4 5 4c-.55 0-1 .45-1 1 0 .28.11.53.29.71L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71 0 .55.45 1 1 1 .28 0 .53-.11.71-.29l4.29-4.3 4.29 4.29c.18.19.43.3.71.3.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71L11.41 10z" id="cross_mark_6_"/></svg>
      </div>
    </div>
  )
})

const SortableList = SortableContainer((params) => {
  return (
    <div>
      {params.items.map((header, idx) => (
        <SortableItem key={`item-${idx}`} index={idx} header={header} idx={idx} onChange={params.onChange} />
      ))}
    </div>
  );
});

export default Headers;
