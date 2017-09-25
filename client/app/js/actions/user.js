"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export const login = (data) => {
     return function(dispatch){
        Api.login(data).then(function(res,err){
            return dispatch({
                type: Constants.LOGIN,
                payload: res
            });
        },function(err){
            return dispatch({
                type: Constants.INVALID_LOGIN,
                payload: err.responseJSON
            });
        });
    }
    
};


export const register = (user) => {
    return function(dispatch){
        Api.post('/',user).then(function(res, err){
            return dispatch({
                type: Constants.REGISTRATION,
                payload: res
            });
        },function(err){
            return dispatch({
                type: Constants.INVALID_REGISTRATION,
                payload: err.responseJSON
            });
        });
    }
};


export const resetPassword = (user) => {
     return function(dispatch){
        Api.resetPassword(user).then(function(res,err){
            return dispatch({
                type: Constants.RESET_PASSWORD,
                payload: res
            });
        },function(err){
            return dispatch({
                type: Constants.ERROR_RESET_PASSWORD,
                payload: err.responseJSON
            });
        });
    }
};

export const sendResetPassowrd = (data) => {
     return function(dispatch){
        return Api.put('/password', data).then(function(res,err){
            // return dispatch({
                // type: Constants.RESET_PASSWORD_INSTRUCTION,
                // payload: res
            // });
            // return err;
        },function(err){
            // return err;
            // return dispatch({
                // type: Constants.ERROR_RESET_PASSWORD_INSTRUCTION,
                // payload: err.responseJSON
            // });
        });
    }
};

