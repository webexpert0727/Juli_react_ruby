import React, {Component} from 'react';
import {connect} from 'react-redux';

/*
 * We need "if(!this.props.user)" because we set state to null by default
 * */

class FooterComponent extends Component {
    render() {
   
        return (
            <nav className="navbar navbar-default navbar-fixed-bottom">
              <div className="container-fluid">
                <div className="navbar-header">
                </div>
              </div>
            </nav>
        );
    }
}

// "state.activeUser" is set in reducers/index.js
function mapStateToProps(state) {
    return {
        user: state.activeUser
    };
}

export default connect(mapStateToProps)(FooterComponent);
