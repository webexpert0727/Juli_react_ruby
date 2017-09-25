"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export const getStudents = () => {
     return function(dispatch){
        Api.get('/students').then(function(res,err){
            return dispatch({
                type: Constants.GET_STUDENTS,
                payload: res
            });
        });
    }
};

