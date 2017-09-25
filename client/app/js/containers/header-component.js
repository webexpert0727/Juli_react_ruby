import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import SettingsStore from '../settings';

/*
 * We need "if(!this.props.user)" because we set state to null by default
 * */

class HeaderComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: SettingsStore.currentUser()
    }
  }

  addLesson(){
    
  }

  render() {
    var user = ((this.props.user && this.props.user.id) || SettingsStore.currentUser());
    return (
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="javascript:void(0)">Brand</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                {!user &&
                  <li><Link to='/login'>Login</Link></li>
                }
                {!user &&
                  <li><Link to='/register'>Register</Link></li>
                }
                {user &&
                  <li><Link to="/calender">Calender</Link></li>
                }
                {user &&
                  <li><a href='javascript:void(o)' onClick={(e)=>{this.addLesson()}}>Add Lesson</a></li>
                }
                {user &&
                  <li><a href='/api/v1/sign_out' data-method="delete">Logout</a></li>
                }
              </ul>
            </div>
          </div>
        </nav>
    );
  }
}

// "state.activeUser" is set in reducers/index.js
function mapStateToProps(state) {
    return {
        user: state.userLoginDetail
    };
}

export default connect(mapStateToProps)(HeaderComponent);
