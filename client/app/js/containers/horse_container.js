import React, { Component } from 'react';
import { connect } from 'react-redux';
import AtomicForm from 'atomic-form';
import { bindActionCreators } from 'redux';
import LessonAction from '../actions/lesson';
import Modal from 'simple-react-modal';
import BaseComponent from '../components/base_component';

class HorseContainer extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = this.getState();
    // this.setNohoursCount = 0;
    this._bind('addHorse', 'closeModal', 'afterValidation', 'onFilter');
    // this.averageOfNoHorse = this.averageOfNoHorse.bind(this);
  }

  getState() {
    //Optional - Set form initial data.
    return {
      initialData: {
        horse_id: '',
        week: ''
      },
      openModel: false,
      setNohoursCount: 0,
      horsesReportCount: 0,
      count: 0
    };
  }

  componentWillMount() {
    this.props.getHorses();
    this.props.getHorsesReport(this.state.initialData);
  }

  componentDidMount() {}

  closeModal() {
    this.setState({ openModel: false });
  }

  addHorse() {
    this.setState({ openModel: true });
  }

  afterValidation(formValidations) {
    this.setState({ validations: formValidations });
  }

  onFilter(e) {
    const initialData = this.state.initialData;
    var key = e.target.name;
    initialData[key] = e.target.value;
    this.setState({ initialData }, function() {
      this.props.getHorsesReport(initialData);
    });
  }

  doSubmit(formData) {
    var data = { horses: { name: formData.horse_name } };
  }

  onInputChange() {
    var formData = this.refs.MainForm.formData();
    var formValidations = this.refs.MainForm.validateForm(formData);
    this.setState((validations: formValidations));
  }

  validationMessage(field) {
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        return _.map(this.state.validations[field].message, message => {
          return <span style={{ color: 'red' }}>{message}</span>;
        });
      }
    }
    return <div />;
  }

  averageDayPerHorse(chartData) {
    if (chartData) {
      if (chartData.day_off_count <= 0) {
        return 0;
      } else {
        return chartData.day_off_count / chartData.filter_data.used_horse_count;
      }
    }
  }

  averageOfNoHorse = callback => {
    setTimeout(() => {
      var noCount = document.getElementsByClassName('noHorseImg').length;
      if (noCount) {
        if (noCount <= 0) {
          callback(0);
        } else {
          callback(noCount / 2);
        }
      }
    });
  };

  createHorsesDay(horseRecords, day) {
    const horseIndex = _.findIndex(horseRecords, function(o) {
      return o.day === day;
    });

    var horseRecord = '';
    if (horseIndex >= 0) {
      horseRecord = horseRecords[horseIndex];
    } else {
      horseRecord = [];
    }

    if (horseRecord.day === day && horseRecord !== []) {
      if (horseRecord.count > 2) {
        return (
          <td>
            <img src={'/assets/hrseIcnGreenSmall.png'} className="" />
            <img src={'/assets/hrseIcnGreenPlus.png'} className="" />
          </td>
        );
      } else {
        var indents = [];
        for (var i = 0; i < horseRecord.count; i++) {
          indents.push(
            <img key={i} src={'/assets/hrseIcnGreenSmall.png'} className="" />
          );
        }
        return <td>{indents}</td>;
      }
    } else {
      return (
        <td>
          <img src={'/assets/noHorses.png'} className="noHorseImg" />
        </td>
      );
    }
  }

  componentWillReceiveProps = () => {};

  render() {
    var horses = _.map(this.props.horses);
    var week = _.map(this.props.week);
    var horsesReport = _.map(this.props.horsesReport);
    var chartData = this.props.chartData;
    horsesReport.map(
      (horse, index) =>
        (this.state.count = this.state.count + (7 - horse.length))
    );
    var App = React.createClass({
      getInitialState() {
        return {
          donutval: parseInt(this.props.donutval)
        };
      },
      updateVal(e) {
        this.setState({ donutval: e.target.value });
      },

      render() {
        return (
          <div>
            <DonutChart
              isHorseUsedThisWeek={this.props.horseUse}
              totalHorses={this.props.totalHorses}
              value={this.state.donutval || 0}
            />
          </div>
        );
      }
    });

    // horsesReport.map(
    //   (horse, index) =>
    //     (this.state.count = this.state.count + (7 - horse.length))
    // );

    const DonutChart = React.createClass({
      propTypes: {
        value: React.PropTypes.number, // value the chart should show
        valuelabel: React.PropTypes.string, // label for the chart
        size: React.PropTypes.number, // diameter of chart
        strokewidth: React.PropTypes.number // width of chart line
      },
      getDefaultProps() {
        return {
          value: 0,
          valuelabel: 'Completed',
          size: 100,
          strokewidth: 7
        };
      },
      createMarkup() {
        return { __html: '/' + this.props.totalHorses };
      },
      render() {
        const halfsize = this.props.size * 0.5;
        const radius = halfsize - this.props.strokewidth * 0.5;
        const circumference = 2 * Math.PI * radius;
        const strokeval = this.props.value * circumference / 10;
        const dashval = strokeval + ' ' + circumference;

        const trackstyle = { strokeWidth: this.props.strokewidth };
        const indicatorstyle = {
          strokeWidth: this.props.strokewidth,
          strokeDasharray: dashval
        };
        const rotateval = 'rotate(-90 ' + halfsize + ',' + halfsize + ')';

        return (
          <svg
            width={this.props.size}
            height={this.props.size}
            className="donutchart"
          >
            <circle
              r={radius}
              cx={halfsize}
              cy={halfsize}
              transform={rotateval}
              style={trackstyle}
              className="donutchart-track"
            />
            <circle
              r={radius}
              cx={halfsize}
              cy={halfsize}
              transform={rotateval}
              style={indicatorstyle}
              className="donutchart-indicator"
            />
            <text
              className="donutchart-text"
              x={halfsize}
              y={halfsize}
              style={{ textAnchor: 'middle' }}
            >
              <tspan className="donutchart-text-val">{this.props.value}</tspan>
              {this.props.isHorseUsedThisWeek ? (
                <tspan
                  className="donutchart-text-val"
                  dangerouslySetInnerHTML={this.createMarkup()}
                />
              ) : (
                ''
              )}
              <tspan
                className="donutchart-text-label"
                x={halfsize}
                y={halfsize + 10}
              />
            </text>
          </svg>
        );
      }
    });

    document.querySelector('#main');
    document.querySelector('#main1');

    return (
      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Horses Workload</h1>
            <div className="rhtSrch">
              <form>
                <input
                  type="text"
                  placeholder="Search Clients"
                  className="test"
                />
                <button type="submit" />
              </form>
            </div>
          </div>
          <div className="rghtCalCntnr">
            <div className="rccInr">
              <div className="addHorseRowWrap">
                <div className="col-sm-6 col-xs-12 breadcrumbWrap">
                  <ol className="breadcrumb">
                    <li>
                      <a href="#">Horses</a>
                    </li>
                    <li className="active">Horse Workload</li>
                  </ol>
                </div>
                <div className="col-sm-6 col-xs-12 addHorsesWrap">
                  <div className="addLsn addHorses">
                    <a
                      href="javascript:void(0)"
                      onClick={e => {
                        this.addHorse(e);
                      }}
                    >
                      Add New Horse
                    </a>
                  </div>
                </div>
              </div>

              <div className="loginCnt">
                <div className="horseTableContainer">
                  <div className="filterRowWrap">
                    <h2 className="filterTitle">Details For {week}</h2>
                    <div className="horseSelectBoxWrap">
                      <h5>Week</h5>
                      <div className="form-group selectpicker">
                        <div className="input-group" id="DateDemo">
                          <input
                            type="text"
                            id="weeklyDatePicker"
                            placeholder="Select Week"
                            name="week"
                            onBlur={e => {
                              this.onFilter(e);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="filterBoxWrap">
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            horses used this week
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <App
                            donutval={
                              chartData &&
                              chartData.filter_data.used_horse_count
                            }
                            totalHorses={chartData && chartData.total_horses}
                            horseUse="true"
                          />
                          <div id="main1" />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            Average lessons per horse
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <App
                            donutval={
                              chartData &&
                              chartData.filter_data.avarage_lessons_per_horse
                            }
                          />
                          <div id="main1" />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            Average days off per horse
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <App
                            donutval={
                              this.state.count /
                              (chartData &&
                                chartData.filter_data.used_horse_count)
                            }
                          />
                          <div id="main1" />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            Horses with no days off
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <App
                            donutval={
                              chartData && chartData.horse_with_no_days_off
                            }
                          />
                          <div id="main1" />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            Horses with 10+ lessons
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <App
                            donutval={chartData && chartData.more_than_10_count}
                          />
                          <div id="main1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="filterTitle">Details For {week}</h2>
                  <div className="horseSelectBoxWrap">
                    <h5>Horse</h5>
                    <select
                      className="form-control horseSelectBox selectpicker"
                      onChange={e => {
                        this.onFilter(e);
                      }}
                      name="horse_id"
                    >
                      <option value="">All</option>
                      {horses.map(horse => (
                        <option key={horse.id} value={horse.id}>
                          {horse.horse_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="table-responsive hidden-xs">
                    <table className="table horseTable">
                      <thead className="headRow">
                        <tr>
                          <th className="text-uppercase">lessons</th>
                          <th colSpan="7" />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="columnTitle">Horse</td>
                          <td className="text-uppercase columnTitle">SUN</td>
                          <td className="text-uppercase columnTitle">MON</td>
                          <td className="text-uppercase columnTitle">TUE</td>
                          <td className="text-uppercase columnTitle">WED</td>
                          <td className="text-uppercase columnTitle">THU</td>
                          <td className="text-uppercase columnTitle">FRI</td>
                          <td className="text-uppercase columnTitle">SAT</td>
                        </tr>
                        {horsesReport.map((horse, index) => (
                          <tr key={index} data-status={horse[0]['horse_name']}>
                            <td className="rowTitle">
                              <div className="iconWrap blueHorse">
                                <img src={'/assets/hrseIcn.png'} className="" />
                              </div>
                              <span>{horse[0]['horse_name']}</span>
                            </td>
                            {this.createHorsesDay(horse, 'Sunday')}
                            {this.createHorsesDay(horse, 'Monday')}
                            {this.createHorsesDay(horse, 'Tuesday')}
                            {this.createHorsesDay(horse, 'Wednesday')}
                            {this.createHorsesDay(horse, 'Thursday')}
                            {this.createHorsesDay(horse, 'Friday')}
                            {this.createHorsesDay(horse, 'Saturday')}
                          </tr>
                        ))}
                        <tr>
                          <td className="textItalic">
                            {horsesReport.length} horses
                          </td>
                          <td colSpan="7" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="table-responsive visible-xs">
                    <table className="table horseTable">
                      <thead className="headRow">
                        <tr>
                          <th className="text-uppercase">lessons</th>
                          <th colSpan="7" />
                        </tr>
                      </thead>
                      <tbody>
                        {horsesReport.map((horse, index) => (
                          <tr>
                            <td className="rowTitle">
                              <div className="iconWrap blueHorse">
                                <img src={'/assets/hrseIcn.png'} className="" />
                              </div>
                              <span>{horse[0]['horse_name']}</span>
                            </td>
                            <td>
                              <span className="colorGreen">{horse.length}</span>
                              <img
                                src={'/assets/hrseIcnGreenSmall.png'}
                                className=""
                              />
                            </td>
                            <td>
                              <span>{7 - horse.length}</span>
                              <img
                                src={'/assets/noHorses.png'}
                                className="noHorseImg"
                              />
                            </td>
                            {/* <td>
                              <a href="#" className="">
                                <img
                                  src={'/assets/calRghtIcnGry.png'}
                                  className=""
                                />
                              </a>
                            </td> */}
                          </tr>
                        ))}
                        <tr>
                          <td className="textItalic">
                            {horsesReport.length} horses
                          </td>
                          <td colSpan="7" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <div className="footTop">
            <span>
              <img src="assets/footerIcn.png" alt="Footer Icon" />
            </span>
          </div>
          <div className="footBtm" />
        </footer>
        <Modal
          show={this.state.openModel}
          onClose={e => {
            this.closeModal();
          }}
        >
          <div className="row">
            <div className="panel panel-login">
              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h3>Add Horse</h3>
                    <hr />
                    <AtomicForm
                      ref="editLessonForm"
                      initialData={this.state.initialData}
                      doSubmit={this.doSubmit}
                      afterValidation={this.afterValidation}
                    >
                      <div className="form-group">
                        <input
                          type="text"
                          ref="horse_name"
                          className="form-control"
                          placeholder="Horse Name"
                          validate={[
                            {
                              message: 'Name is required',
                              validate: 'isPresent'
                            }
                          ]}
                        />
                        {this.validationMessage('horse_name')}
                      </div>
                      <div className="form-group" />
                      <div className="form-group">
                        <input
                          type="submit"
                          name="login-submit"
                          className="col-md-offset-4 btn btn-success btn-lg"
                          value="Submit"
                        />
                      </div>
                    </AtomicForm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    horses: state.horses,
    horsesReport: state.horsesReport && state.horsesReport.horses_report,
    week: state.horsesReport && state.horsesReport.week,
    chartData: state.horsesReport && state.horsesReport.chart_data
  };
};

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHorses: LessonAction.getHorses,
      getHorsesReport: LessonAction.getHorsesReport
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(HorseContainer);
