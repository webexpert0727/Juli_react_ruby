import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                from '../actions/lesson';
import Modal                        from "simple-react-modal";
import BaseComponent                from '../components/base_component';

class HorseContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state = this.getState();
    this._bind('addHorse','closeModal','afterValidation')
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
  
  addHorse(){
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
          <div className="rghtHeadTop clearfix">
            <h1>Horses</h1>
            <div className="rhtSrch">
              <div className="addLsn"><a href="javascript:void(0)" onClick={(e)=>{ this.addHorse(e) }}>Add New Horse</a></div>
            </div>
          </div>
          <div className="rghtCalCntnr">
            <div className="rccInr"> 
              <div className="loginCnt">
                <table className="table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>Horse Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horses}
                  </tbody>
              </table>

                </div>
            </div>
          </div>
          </div>
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

export default connect(mapStateToProps, matchDispatchToProps)(HorseContainer);
