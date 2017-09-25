"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export const getInstructors = () => {
     return function(dispatch){
        Api.get('/instructors').then(function(res,err){
            return dispatch({
                type: Constants.GET_INSTRUCTORS,
                payload: res
            });
        });
    }
};

