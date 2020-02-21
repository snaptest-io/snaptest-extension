import React from 'react'
import Moment from 'moment'
import _ from 'lodash'
import Chart from 'chart.js'
import Message from '../../../util/Message.js'

class ResultChart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.resultsOverview, nextProps.resultsOverview)) {
      var chartData = this.getChartData(nextProps.resultsOverview);
      this.chart.data.datasets = chartData.data.datasets;
      this.chart.options = chartData.options;
      this.chart.update();
    }
  }

  getHourData(resultsOverview) {

    // Combine hours together

    var mergedDataPointMap = {};
    var maxDate;
    var minDate;

    resultsOverview.forEach((dataPoint) => {
      var date = new Date(dataPoint.year, dataPoint.month - 1, dataPoint.day, dataPoint.hour);

      if (!maxDate || date.valueOf() > maxDate.valueOf()) maxDate = date;
      if (!minDate || date.valueOf() < minDate.valueOf()) minDate = date;

      if (mergedDataPointMap[date]) {
        mergedDataPointMap[date].actions_passed += dataPoint.actions_passed;
        mergedDataPointMap[date].actions_failed += dataPoint.actions_failed;
        mergedDataPointMap[date].tests_total += dataPoint.tests;
        mergedDataPointMap[date].tests_failed += (dataPoint.tests - dataPoint.tests_passed);
        mergedDataPointMap[date].tests_passed += dataPoint.tests_passed;
        mergedDataPointMap[date].duration += dataPoint.duration;
        mergedDataPointMap[date].suites += dataPoint.suites;
      } else {
        mergedDataPointMap[date] = {
          actions_passed: dataPoint.actions_passed,
          actions_failed: dataPoint.actions_failed,
          tests_total: dataPoint.tests,
          tests_failed: dataPoint.tests - dataPoint.tests_passed,
          tests_passed: dataPoint.tests_passed,
          duration: dataPoint.duration,
          suites: dataPoint.suites
        }
      }
    });

    var actionsPassedDataSet = [];
    var actionsFailedDataSet = [];
    var testsTotalDataSet = [];
    var testsFailedDataSet = [];
    var testsPassedDataSet = [];
    var durationDataSet = [];
    var suitesDataSet = [];

    for (var date in mergedDataPointMap) {
      actionsPassedDataSet.push({t: date, y: mergedDataPointMap[date].actions_passed});
      actionsFailedDataSet.push({t: date, y: mergedDataPointMap[date].actions_failed});
      testsTotalDataSet.push({t: date, y: mergedDataPointMap[date].tests_total});
      testsPassedDataSet.push({t: date, y: mergedDataPointMap[date].tests_passed});
      testsFailedDataSet.push({t: date, y: mergedDataPointMap[date].tests_failed});
      durationDataSet.push({t: date, y: mergedDataPointMap[date].duration});
      suitesDataSet.push({t: date, y: mergedDataPointMap[date].suites});
    };

    var result = {
      data: {
        datasets: [
          {
            data: testsPassedDataSet,
            label: "Tests Passed",
            backgroundColor: 'rgb(99, 255, 132)'
          },
          {
            data: testsFailedDataSet,
            label: "Tests Failed",
            backgroundColor: 'rgb(255, 99, 132)'
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: false,
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            barThickness: 6,
            type: 'time',
            bounds: "ticks",
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'M/D ha'
              }
            },
            stacked: true,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            stacked: true
          }]
        }
      }
    };

    if (minDate) result.options.scales.xAxes[0].time.min =  Moment(minDate).subtract(3, 'hours');
    if (maxDate) result.options.scales.xAxes[0].time.max = Moment(maxDate).add(3, 'hours');

    return result;

  }

  getChartData(resultsOverview) {
    return this.getHourData(resultsOverview);
  }

  componentDidMount() {
    var newCanvas = document.createElement("canvas");
    newCanvas.height = 200;
    this.refs.chart.appendChild(newCanvas);
    var ctx = newCanvas.getContext('2d');
    var chartData = this.getChartData(this.props.resultsOverview);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: chartData.data,
      options: chartData.options
    })
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return (
      <div className="ResultChart">
        <div ref="chart"></div>
      </div>
    )
  }

}

export default ResultChart;
