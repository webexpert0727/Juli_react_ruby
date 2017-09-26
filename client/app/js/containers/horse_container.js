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
    this._bind('addHorse', 'closeModal', 'afterValidation');
  }

  getState() {
    //Optional - Set form initial data.
    return {
      initialData: {},
      openModel: false
    };
  }

  componentWillMount() {
    this.props.getHorses();
  }

  closeModal() {
    this.setState({ openModel: false });
  }

  addHorse() {
    this.setState({ openModel: true });
  }

  afterValidation(formValidations) {
    this.setState({ validations: formValidations });
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

  createHorsesDay(horse, day) {
    if (horse.day === day) {
      if (horse.count > 2) {
        return (
          <td>
            <img src={'/assets/hrseIcnGreenSmall.png'} className="" />
            <img src={'/assets/hrseIcnGreenPlus.png'} className="" />
          </td>
        );
      } else {
        return (
          <td>
            <img src={'/assets/hrseIcnGreenSmall.png'} className="" />
            <img src={'/assets/hrseIcnGreenSmall.png'} className="" />
          </td>
        );
      }
    } else {
      return (
        <td>
          <img src={'/assets/horseGreySmall.png'} className="" />
        </td>
      );
    }
  }

  render() {
    var horses = _.map(this.props.horses);
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
                    <h2 className="filterTitle">
                      Details For Aug 27-sept 2,2017
                    </h2>
                    <div className="horseSelectBoxWrap">
                      <h5>Week</h5>

                      <select className="form-control horseSelectBox">
                        <option>Choose a Week</option>
                        <option>Sept 24,2017 to Sept 30,2017</option>
                        <option>Sept 14,2017 to Sept 23,2017</option>
                        <option>Sept 10,2017 to Sept 16,2017</option>
                        <option>Sept 3,2017 to Sept 9,2017</option>
                      </select>
                    </div>
                    <div className="filterBoxWrap">
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            horses used this week
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/aactiveProgressbar.png'}
                            className="img-responsive"
                          />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            horses used this week
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/normalProgressbar.png'}
                            className="img-responsive"
                          />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            horses used this week
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/normalProgressbar.png'}
                            className="img-responsive"
                          />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            horses used this week
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/normalProgressbar.png'}
                            className="img-responsive"
                          />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            horses used this week
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/normalProgressbar.png'}
                            className="img-responsive"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="filterTitle">
                    Details For Aug 27-sept 2,2017
                  </h2>
                  <div className="horseSelectBoxWrap">
                    <h5>Horse</h5>
                    <select className="form-control horseSelectBox">
                      <option>Choose a Horse</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                  <div className="table-responsive">
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
                        {horses.map((horse, index) => (
                          <tr key={index}>
                            <td className="rowTitle">
                              <div className="iconWrap blueHorse">
                                <img src={'/assets/hrseIcn.png'} className="" />
                              </div>
                              <span>{horse.horse_name}</span>
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
                          <td className="textItalic">{horses.length} horses</td>
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
    horses: state.horses
  };
};

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ getHorses: LessonAction.getHorses }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(HorseContainer);
