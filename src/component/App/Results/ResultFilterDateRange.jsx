import React from 'react'
import 'react-dates/initialize';
import Moment from 'moment'
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import Message from "../../../util/Message";

class ResultFilterDateRange extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null
    }
  }

  renderPresetSelector() {
    return <div></div>;
  }

  render() {
    
    const { timeStart, timeEnd } = this.props.resultFilters;
    const startDate = timeStart ? Moment(timeStart) : Moment();
    const endDate = timeEnd ? Moment(timeEnd) :  Moment();

    return (
      <div className="ResultFilterDateRange">
        <DateRangePicker
          startDate={startDate}
          startDateId="your_unique_start_date_id"
          endDate={endDate}
          endDateId="your_unique_end_date_id"
          onDatesChange={(dates) => this.onDatesChange(dates)}
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.setState({ focusedInput })}
          renderCalendarInfo={this.renderPresetSelector}
          keepOpenOnDateSelect
          numberOfMonths={2}
          hideKeyboardShortcutsPanel
          calendarInfoPosition="before"
          customArrowIcon={<div>
            <svg className="svg-daterange-arrow" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.71 9.29l-6-6a1.003 1.003 0 0 0-1.42 1.42L15.59 9H2c-.55 0-1 .45-1 1s.45 1 1 1h13.59l-4.29 4.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l6-6c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71z"/></svg>
          </div>}
          isOutsideRange={() => false}
          minimumNights={0}
        />
      </div>
    )
  }

  onDatesChange(newDates) {

    const { startDate, endDate } = newDates;

    Message.promise("addResultFilter", {
      filterType: "dates",
      filterEntity: {
        timeStart: startDate ? startDate.startOf("day").valueOf() : null,
        timeEnd: endDate ? endDate.endOf("day").valueOf() : null
      }
    });

  }
}

export default ResultFilterDateRange;
