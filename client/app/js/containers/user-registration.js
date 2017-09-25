import React, {Component}                   from 'react';
import {connect}                            from 'react-redux';
import { register }                         from '../actions/user';
import AtomicForm                           from "atomic-form";
import { bindActionCreators }               from 'redux';
import { Link, browserHistory  }            from 'react-router';
import Settings                             from '../settings';
import BaseComponent                        from '../components/base_component';
import Utils                                from "../utils";

class UserRegistration extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this.state = this.getState();
    this._bind('selectRole','doSubmit')
  }
 
  getState() {
    //Optional - Set form initial data. 
    return {
      initialData: {
        
      },
      user_type: 'instructor'
    }
  }

  componentDidMount(){
    $('.selectpicker-register').selectpicker();
  }
 
  componentWillReceiveProps(nextProps){
    if(!nextProps.userLoginDetail.errors){
      Settings.setUser(nextProps.userLoginDetail);
      location.href="/calender";
    }
  }

  afterValidation(formValidations) {
    //Callback after validation fails. 
    this.setState({validations: formValidations});
  }
 
  doSubmit(formData) {
    this.setState({validations: {}, confirmPasswordError: ''});
    var data = {user:{ email: formData.email, password: formData.password,
                password_confirmation: formData.password_confirmation,
                user_type: this.state.user_type, username: formData.name
              }};
    if(formData.password != formData.password_confirmation){
      this.setState({confirmPasswordError: 'password does not match'})
    }else{
      this.props.register(data);
    }
  }

  onInputChange() {
    //Optional - If we want to validate the form from an onChange callback. 
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

  selectRole(e){
    this.setState({user_type: e.target.value})
  }

  render() {
    return (
      <div className="lrCntnr regWrp">
        <div className="lrcInr">
          <div className="loginCnt">
            <div className="topLogo"><img src="/assets/smlLogo.png" alt="Logo" /><p>Powered by <strong>Equine Office</strong></p></div>
              <AtomicForm ref="RegistrationForm" initialData={this.state.initialData} 
                doSubmit={this.doSubmit.bind(this)} afterValidation={this.afterValidation.bind(this)}
                >
                <h1>Register</h1>
                <div className="lrInput">
                  <input type="text" placeholder="Name" ref="name" validate={[{
                    message: "Name is required",
                    validate: "isPresent",
                  }
                  ]} placeholder="name"/>
                  {this.validationMessage("name")}
                </div>

                <div className="lrInput">
                  <input type="text" placeholder="Email" ref="email" validate={[{
                    message: "Must be a valid Email.",
                    validate: "isEmail",
                  }
                  ]} onChange={(e) => {this.onInputChange}} placeholder="email"/>
                  {this.validationMessage("email")}
                  <span style={{color: 'red'}}>{this.props.userLoginDetail && this.props.userLoginDetail.errors && 
                    Utils.formatErrors(this.props.userLoginDetail.errors) == 'email has already been taken' && Utils.formatErrors(this.props.userLoginDetail.errors)}
                  </span><br/>
                </div>
                <div className="lrInput">
                  <input type="password" placeholder="Password" ref="password" validate={[{
                    message: "Password must be at least 5 characters long.",
                    validate: "isLength",
                    args: [5]
                  }
                  ]} placeholder="password"/>
                  {this.validationMessage("password")}
                </div>
                <div className="lrInput">
                  <input type="password" placeholder="Password" ref="password_confirmation" placeholder="password"/>
                </div>
                <span style={{color: 'red'}}>{this.state.confirmPasswordError}</span>
                <span style={{color: 'red'}}>{this.props.userLoginDetail && this.props.userLoginDetail.errors && 
                  Utils.formatErrors(this.props.userLoginDetail.errors) != 'email has already been taken' && 
                  Utils.formatErrors(this.props.userLoginDetail.errors)
                }</span><br/>
                <div className="lrInput">
                  <label>How will you be using this application?</label>
                  <select defaultValue={this.state.user_type} className="selectpicker selectpicker-register" ref="user_type" onChange={(e)=>{this.selectRole(e)}}>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
                <div className="lgBtn">
                  <div className="lrsb orangeBtn"><button type="submit">Sign up</button></div>
                  <div className="btmTextlgn">Already a member? <Link to="/login">Login</Link></div>
                </div>
              </AtomicForm>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    // You can now say this.props.books
    userLoginDetail: state.userLoginDetail
  }
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createBook
    users: destinations => dispatch(destinationActions.getDestinations(destinations))
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({register: register}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(UserRegistration);
