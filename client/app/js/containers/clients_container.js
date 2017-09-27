import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                from '../actions/lesson';
import Modal                        from "simple-react-modal";
import BaseComponent                from '../components/base_component';

class ClientsContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state = this.getState();
    this._bind('addClient','closeModal','afterValidation')
  }

  getState() {
    //Optional - Set form initial data.
    return {
      initialData: {
      },
      openModel: false
    }
  }

  componentWillMount(){
    this.props.getHorses();
  }

  closeModal() {
    this.setState({openModel: false});
  }

  addClient(){
    this.setState({openModel: true});
  }

  afterValidation(formValidations) {
    this.setState({validations: formValidations});
  }

  doSubmit(formData) {
    var data = {horses:{ name: formData.horse_name}}
  }

  onInputChange() {
    var formData = this.refs.MainForm.formData();
    var formValidations = this.refs.MainForm.validateForm(formData);
    this.setState(validations: formValidations);
  }

  validationMessage(field) {
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        return _.map(this.state.validations[field].message, (message) => {
          return <span style={{color: 'red'}}>{message}</span>;
        });
      }
    }
    return <div/>;
  }

  createHorsesList(horse){
    return <tr key={horse.id}><td>{horse.id}</td><td>{horse.horse_name}</td></tr>
  }

  render() {
    var horses = _.map(this.props.horses, this.createHorsesList);

    return (
      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">

          {/* Start >>> Header of Right Content */}
          <div className="rghtHeadTop clearfix">
            <h1>Clients</h1>
            <div className="rhtSrch">
              <form>
                <input type="text" placeholder="Search clients" className="test"/>
                <button type="submit"></button>
              </form>
            </div>
          </div>

          <div className="rghtHeadTop rghtHeadMid clearfix">
            <h3>Clients > Larissa Johannson</h3>
            <div className="rhtSrch">
              <div className="addLsn rtClient"><a href="javascript:void(0)" onClick={(e)=>{ this.addClient(e) }}>Add a client</a></div>
            </div>
          </div>
          {/* End >>> Header of Right Content */}

          {/* Start >>> Content of Right Content */}
          <div className="rghtContent clearfix">

            {/* Start >> Top */}
            <div className="rghtContentHeader row">
              <div className="col-lg-2 col-sm-2">
                <img className="clientLogo img-circle" src="/assets/userImage.png" alt="Client Logo" width="150" height="150" />
              </div>
              <div className="clientName col-lg-3 col-sm-3">
                <span>Larissa Johannson</span>
                <span className="custom_caret"><span className="caret"></span></span>
              </div>
              <div className="col-lg-7 col-sm-7">
                <div className="clientOptions row">
                  <div className="clientOption col-lg-4 col-sm-4">
                    <div className="optionHeader">
                      <span>MAKEUP LESSONS</span>
                    </div>
                    <div className="optionContent">
                      <span className="first">2 lessons</span><br/>
                      <span className="second">1 EXPIRES SOON</span>
                    </div>
                  </div>
                  <div className="clientOption col-lg-4 col-sm-4">
                    <div className="optionHeader">
                      <span>NEXT LESSON</span>
                    </div>
                    <div className="optionContent">
                      <span className="first">Fri, Aug 25, 2017</span><br/>
                      <span className="second">9 AM - 10 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End >> Top */}

            {/* Start >> Lessons */}
            <div className="rghtContentSection row">
              <div className="col-lg-8 col-sm-8">
                <div className="sectionHeader">
                  <h3>LESSONS</h3>
                  <div className="bbsnglBtn primaryBtn">
                    <button type="button" >Award makeup lesson</button>
                  </div>
                  <div className="bbsnglBtn orangeBtn">
                    <button type="button">Schedule a lesson</button>
                  </div>
                </div>
                <div className="sectionContent">
                  <h1>Last Lesson</h1>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date and Time</th>
                        <th>Lesson Name</th>
                        <th>Instructor</th>
                        <th>Assigned to</th>
                        <th>Status</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="first">Fri, Aug 18, 2017</span><br/>9 AM - 10 AM</td>
                        <td><a href="javascript:;"><span className="first">Beginner Lesson Group 1</span></a></td>
                        <td>
                          <div className="clientIcn staffIcn"><img className="clientIcn staffIcn" src="/assets/staffIcn.png" alt="Client Icon" /></div>
                          <span>Shelly Abrams</span>
                        </td>
                        <td>
                          <div className="clientIcn hrseIcn"><img className="clientIcn hrseIcn" src="/assets/hrseIcn.png" alt="Client Icon" /></div>
                          <span>Sally</span>
                        </td>
                        <td>Scheduled</td>
                        <td><span className="checkMark">&#10004;</span></td>
                      </tr>
                    </tbody>
                  </table>

                  <h1>Upcoming Lessons</h1>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date and Time</th>
                        <th>Lesson Name</th>
                        <th>Instructor</th>
                        <th>Assigned to</th>
                        <th>Status</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="first">Fri, Aug 25, 2017</span><br/>9 AM - 10 AM</td>
                        <td><a href="javascript:;"><span className="first">Beginner Lesson Group 1</span></a></td>
                        <td>
                          <div className="clientIcn staffIcn"><img className="clientIcn staffIcn" src="/assets/staffIcn.png" alt="Client Icon" /></div>
                          <span>Shelly Abrams</span>
                        </td>
                        <td>
                        <div className="clientIcn hrseIcn"><img className="clientIcn hrseIcn" src="/assets/hrseIcn.png" alt="Client Icon" /></div>
                          <span>Sally</span>
                        </td>
                        <td>Scheduled</td>
                        <td><span className="checkMark">&#10004;</span></td>
                      </tr>
                      <tr>
                        <td><span className="first">Fri, Aug 18, 2017</span><br/>9 AM - 10 AM</td>
                        <td><a href="javascript:;"><span className="first">Beginner Lesson Group 1</span></a></td>
                        <td>
                          <div className="clientIcn staffIcn"><img className="clientIcn staffIcn" src="/assets/staffIcn.png" alt="Client Icon" /></div>
                          <span>Shelly Abrams</span>
                        </td>
                        <td>
                        <div className="clientIcn hrseIcn"><img className="clientIcn hrseIcn" src="/assets/hrseIcn.png" alt="Client Icon" /></div>
                          <span>Sally</span>
                        </td>
                        <td>Scheduled</td>
                        <td><span className="checkMark">&#10004;</span></td>
                      </tr>
                      <tr>
                        <td><span className="first">Fri, Aug 11, 2017</span><br/>9 AM - 10 AM</td>
                        <td><a href="javascript:;"><span className="first">Beginner Lesson Group 1</span></a></td>
                        <td>
                          <div className="clientIcn staffIcn"><img className="clientIcn staffIcn" src="/assets/staffIcn.png" alt="Client Icon" /></div>
                          <span>Shelly Abrams</span>
                        </td>
                        <td>
                        <div className="clientIcn hrseIcn"><img className="clientIcn hrseIcn" src="/assets/hrseIcn.png" alt="Client Icon" /></div>
                          <span>Sally</span>
                        </td>
                        <td>Scheduled</td>
                        <td><span className="checkMark">&#10004;</span></td>
                      </tr>
                    </tbody>
                  </table>

                  <h1>Makeup Lessons</h1>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Lesson Name</th>
                        <th>Missed Lesson</th>
                        <th>Makeup Lesson Expires On</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><a href="javascript:;"><span className="first">Beginner Lesson Group 1</span></a></td>
                        <td><span className="first">Fri, Aug 25, 2017</span></td>
                        <td><span className="first">Fri, Sep 8, 2017</span></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="bbsnglBtn primaryBtn">
                    <button type="button" >View all lessons</button>
                  </div>

                </div>
              </div>
              <div className="col-lg-4 col-sm-4">
                <div className="sectionHeader">
                  <h3>INCLUDED ON BILL</h3>
                </div>
                <div className="sectionContent">
                  <div className="contentTitle">
                    <span>Students</span>
                  </div>
                  <div className="contentItems">
                    <div className="contentItem">
                      <a href="javascript:;"><div className="clientIcn"><img className="clientIcn" src="/assets/clientIcn.png" alt="Client Icon" /></div> Sarah Johannson</a>
                    </div>
                    <div className="contentItem">
                      <a href="javascript:;"><div className="clientIcn"><img className="clientIcn" src="/assets/clientIcn.png" alt="Client Icon" /></div> Jessica Johannson</a>
                    </div>
                    <div className="contentItem">
                      <a href="javascript:;"><div className="clientIcn"><img className="clientIcn" src="/assets/clientIcn.png" alt="Client Icon" /></div> Rebecca Johannson</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End >> Lessons */}

            {/* Start >> Notes */}
            <div className="rghtContentSection row">
              <div className="col-lg-12 col-sm-12">
                <div className="sectionHeader">
                  <h3>NOTES</h3>
                </div>
                <div className="sectionContent">
                  <div className="contentTitle">
                    <span>Notes are only visible to you</span>
                  </div>
                  <p>Notes about this client.</p>
                </div>
              </div>
            </div>
            {/* End >> Notes */}

            {/* Start >> Client & Billing details */}
            <div className="rghtContentSection row">
              <div className="col-lg-6 col-sm-6">
                <div className="sectionHeader">
                  <h3>CLIENT DETAILS</h3>
                </div>
                <div className="sectionContent">
                  <div className="contentTitle">
                    <span>Mailing Address</span>
                  </div>

                  <p>5005 Castle Creek Road</p>
                  <p>Dayton, Ohio 14590</p>

                  <div className="contentTitle">
                    <span>Home Phone</span>
                  </div>

                  <p>(555) 646-7771</p>

                  <div className="contentTitle">
                    <span>Cell Phone</span>
                  </div>

                  <p>(555) 212-4554</p>

                  <div className="contentTitle">
                    <span>Emergency Contact</span>
                  </div>

                  <p>John Johannson (husband)</p>
                  <p>(555) 212-3344</p>
                </div>
              </div>
              <div className="col-lg-6 col-sm-6">
                <div className="sectionHeader">
                  <h3>BILLING DETAILS</h3>
                </div>
                <div className="sectionContent">
                  <div className="contentTitle">
                    <span>Send all invoices and billing correspondence to</span>
                  </div>

                  <p>Client</p>

                  <div className="contentTitle">
                    <span>Preferred billing method</span>
                  </div>

                  <p>Check</p>
                </div>
              </div>
            </div>
            {/* End >> Client & Billing details */}

            {/* Start >> Buttons */}
            <div className="rghtContentSection row col-lg-offset-3 col-sm-offset-3">
              <div className="btmBtns col-lg-4 col-sm-4">
                <div className="bbsnglBtn primaryBtn">
                  <button type="button">Contact client</button>
                </div>
              </div>
              <div className="btmBtns col-lg-4 col-sm-4">
                <div className="bbsnglBtn orangeBtn">
                  <button type="button">Edit client</button>
                </div>
              </div>
            </div>
            {/* End >> Buttons */}

          </div>
          {/* End >>> Content of Right Content */}
        </div>

        {/* Start >>> Footer of Right Content */}
        <footer>
          <div className="footTop"><span><img src="assets/footerIcn.png" alt="Footer Icon" /></span></div>
          <div className="footBtm"></div>
        </footer>
        {/* End >>> Footer of Right Content */}

        <Modal show={this.state.openModel} onClose={(e)=> { this.closeModal()}}>
            <div className="row">
                <div className="panel panel-login">
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-lg-12">
                      <h3>Add Horse</h3>
                      <hr/>
                        <AtomicForm ref="editLessonForm" initialData={this.state.initialData}
                          doSubmit={this.doSubmit} afterValidation={this.afterValidation}>
                          <div className="form-group">
                            <input type="text" ref="horse_name" className="form-control" placeholder="Horse Name" validate={
                              [{
                              message: "Name is required",
                              validate: "isPresent",
                              }]}/>
                              {this.validationMessage("horse_name")}
                          </div>
                          <div className="form-group">
                          </div>
                          <div className="form-group">
                          <input type="submit" name="login-submit" className="col-md-offset-4 btn btn-success btn-lg" value="Submit"/>
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
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getHorses: LessonAction.getHorses, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ClientsContainer);
