import 'babel-polyfill';
import React from 'react';
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import allReducers from '../reducers';
import App from '../components/App';
import Login from '../components/Login';
import ForgetPassword from '../components/ForgetPassword';
import Register from '../components/Register';
import Calender from '../components/Calender';
import Horses from '../components/horses';
import Clients from '../components/Clients';
import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router';
import SettingsStore from '../settings';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const logger = createLogger();
const store = createStore(
    allReducers,
    applyMiddleware(thunk, promise, logger)
);
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
    <Provider store={store}>
      <Router history = {history}>
        <Route path = "/" component = {App}>
          <Route path = "/login" component = {Login} onEnter={checkLogin}/>
          <Route path = "/register" component = {Register} onEnter={checkLogin}/>
          <Route path = "/calender" component = {Calender} onEnter={needLogin}/>
          <Route path = "/horses" component = {Horses} onEnter={needLogin}/>
          <Route path = "/clients" component = {Clients} onEnter={needLogin}/>
          <Route path = "/api/v1/password/edit" component = {ForgetPassword} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('root')
);


function isLogin(nextState, replace) {
    let loggedIn = SettingsStore.currentUser();
    if(nextState.location.pathname == '/' && !loggedIn){
      replace({
        pathname: '/login',
      })
    }
}

function checkLogin(nextState, replace) {
  let loggedIn = SettingsStore.currentUser();
  if((nextState.location.pathname == '/register' || nextState.location.pathname == '/login') && loggedIn){
    replace({
      pathname: '/',
    })
  }
}

function needLogin(nextState, replace) {
    let loggedIn = SettingsStore.currentUser();
    if(!loggedIn){
      replace({
        pathname: '/login',
      })
    }
}