import React from 'react';
import UserList from '../containers/user-list';
import UserDetails from '../containers/user-detail';
import Header from '../containers/header-component';
import Footer from '../containers/footer-component';
import Settings from '../settings';
import { Link, browserHistory  }      from 'react-router';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "Welcome",
      user: Settings.currentUser() || {}
    };
  }

  changeTitle(title) {
    this.setState({title});
  }

  render() {
    var user = Settings.currentUser();
    return (
      <span>
        {user && user.id &&
          <div className="leftMenu">
            <div className="mainMenuIcn"></div>
              <div className="lmInr">
                <div className="leftuserTop">
                  <div className="lutImage">
                    <img src="/assets/userImage.png" alt="User Image" />
                  </div>
                    <h2>Cold Brook Stables</h2>
                  </div>
                  <div className="leftMainMenu">
                    <div className="lmmInr mCustomScrollbar" data-mcs-theme="dark">
                      <ul>
                        <li><Link to="dashboard"><img src="/assets/dashbrdIcn.png" alt="Menu Icons" /> Dashboard</Link></li>
                        <li><Link to="calender" className="active"><img src="/assets/calIcn.png" alt="Menu Icons" /> Calendar</Link></li>
                        <li><Link to="clients"><img src="/assets/clientIcn.png" alt="Menu Icons" /> Clients</Link></li>
                        <li><Link to="horses"><img src="/assets/hrseIcn.png" alt="Menu Icons" /> Horses</Link></li>
                        <li><Link to="staff"><img src="/assets/staffIcn.png" alt="Menu Icons" /> Staff</Link></li>
                        <li><Link to="invoices"><img src="/assets/invoiceIcn.png" alt="Menu Icons" /> Invoices</Link></li>
                        <li><Link to="reports"><img src="/assets/rprtsIcn.png" alt="Menu Icons" /> Reports</Link></li>
                        <li><a href='/api/v1/sign_out' data-method="delete"><img src="/assets/staffIcn.png" alt="Menu Icons" /> Logout</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="lmFoot">
                      <div className="lmfImg"><img src="/assets/ftrLogo.png" alt="Foot Logo" /></div>
                      <p>Powered by <strong>Equine Office</strong></p>
                      <ul>
                          <li><a href="">Terms</a></li>
                          <li><a href="">Privacy Policy</a></li>
                      </ul>
                  </div>
            </div>
          </div>
        }
        {this.props.location.pathname == "/" && !user && 
          <div className="lrCntnr">
            <div className="lrcInr">
              <div className="lrBtns">
                <div className="topLogo">
                  <img src="/assets/smlLogo.png" alt="Logo"/>
                <p>Powered by <strong>Equine Office</strong></p></div>
                <div className="lrBtnsInr">
                  <div className="lrsb primaryBtn"><Link to="/login">Login</Link></div>
                  <div className="lrsb orangeBtn"><Link to="/register">Register</Link></div>
                </div>
              </div>
            </div>
          </div>
        }
        {this.props.children}
      </span>
    );
  }
}