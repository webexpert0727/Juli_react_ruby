import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import { sendResetPassowrd }          from '../actions/user';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import { Link, browserHistory  }      from 'react-router';
import Settings                       from '../settings';
import Modal                          from "simple-react-modal";
import BaseComponent                  from '../components/base_component';
import Api                            from "../actions/api";
import Utils                          from "../utils";

class ForgetPasswordContainer extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this.state = this.getState();
    this._bind('afterValidation')
  }
 
  getState() {
    //Optional - Set form initial data. 
    return {
      initialData: {
        
      },
      openModel: false
    }
  }


  afterValidation(formValidations) {
    //Callback after validation fails. 
    this.setState({validations: formValidations});
  }
 
  doSubmit(formData) {
    var that = this;
    var data = {user:{password: formData.password, 
                password_confirmation: formData.confirm_new_password,
                reset_password_token: this.props.routes.reset_password_token
                }};
    Api.put('/password', data).then(function(res,err){
        location.href="/calender";
    },function(err){
      var errros = JSON.parse(err.responseText).errors;
      that.setState({responseErrors: Utils.formatErrors(errros)});
    });
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

  render() {
      return (
      <div className="loginCnt regWrp">
        <div className="topLogo"><img src="/assets/smlLogo.png" alt="Logo" /><p><span>Powered by</span><strong>Equine Office</strong></p></div>
          <AtomicForm ref="LoginForm" initialData={this.state.initialData} 
        doSubmit={this.doSubmit.bind(this)} afterValidation={this.afterValidation}>
            <h1>Change your password New password</h1>
            <div className="lrInput">
              <input type="password" placeholder="password"ref="password" validate={[{
                message: "Required.",
                validate: "isPresent",
              },{
                message: "Password must be at least 6 characters long.",
                validate: "isLength",
                args: [6]
              }
          ]} onChange={(e) => {this.onInputChange}}/>
          {this.validationMessage("password")}
            </div>
            <div className="lrInput">
              <input type="password" placeholder="Confirm password" ref="confirm_new_password" 
              validate={[{
                message: "Password must be at least 6 characters long.",
                validate: "isLength",
                args: [6]
              }
            ]}/>
            {this.validationMessage("confirm_new_password")}
            {this.props.userLoginDetail && this.props.userLoginDetail.error}
            </div>
            {this.state.responseErrors &&
              <div className="lrInput" style={{color: 'red'}}>{this.state.responseErrors}</div>
            }
            <div className="lgBtn">
              <div className="lrsb orangeBtn"><button type="submit">Submit</button></div>
            </div>
          </AtomicForm>
        </div>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
  console.log('aaaaaaaaaaa',state)
  return {
    userLoginDetail: state.userLoginDetail,
    routes: state.routing ? state.routing.locationBeforeTransitions.query : {}
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({sendResetPassowrd: sendResetPassowrd}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ForgetPasswordContainer);
