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
    console.log(this.props);
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

  createHorsesList(horse) {
    return (
      <tr key={horse.id}>
        <td>{horse.id}</td>
        <td>{horse.horse_name}</td>
      </tr>
    );
  }

  render() {
    var horses = _.map(this.props.horses, this.createHorsesList);

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
                    <li class="active">Horse Workload</li>
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
                        <option>Choose a Horse</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
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
                            className=""
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
                            className=""
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
                            className=""
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
                            className=""
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
                            className=""
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
                        <th className="text-uppercase">lessons</th>
                        <th colSpan="7" />
                      </thead>
                      <tbody>
                        <tr>
                          <td className="columnTitle">Horse</td>
                          <td className="text-uppercase columnTitle">sun</td>
                          <td className="text-uppercase columnTitle">sun</td>
                          <td className="text-uppercase columnTitle">sun</td>
                          <td className="text-uppercase columnTitle">sun</td>
                          <td className="text-uppercase columnTitle">sun</td>
                          <td className="text-uppercase columnTitle">sun</td>
                          <td className="text-uppercase columnTitle">sun</td>
                        </tr>
                        <tr>
                          <td className="rowTitle">
                            <div className="iconWrap blueHorse">
                              <img src={'/assets/hrseIcn.png'} className="" />
                            </div>
                            <span>Blueberry</span>
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                        </tr>
                        <tr>
                          <td className="rowTitle">
                            <div className="iconWrap cinnamonHorse">
                              <img src={'/assets/hrseIcn.png'} className="" />
                            </div>
                            <span>Cinnamon</span>
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="rowTitle">
                            <div className="iconWrap">
                              <img
                                src={'/assets/clientImage.png'}
                                className=""
                              />
                            </div>
                            <span>George</span>
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                        </tr>
                        <tr>
                          <td className="rowTitle">
                            <div className="iconWrap blueHorse">
                              <img src={'/assets/hrseIcn.png'} className="" />
                            </div>
                            <span>Blueberry</span>
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                        </tr>
                        <tr>
                          <td className="rowTitle">
                            <div className="iconWrap blueHorse">
                              <img src={'/assets/hrseIcn.png'} className="" />
                            </div>
                            <span>Blueberry</span>
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img
                              src={'/assets/hrseIcnGreenSmall.png'}
                              className=""
                            />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                          <td>
                            <img src={'/assets/hrseIcn.png'} className="" />
                          </td>
                        </tr>
                        <tr>
                          <td className="textItalic">10 horses</td>
                          <td colSpan="6" />
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