"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export const getSections = () => {
     return function(dispatch){
        Api.get('/sections').then(function(res,err){
            return dispatch({
                type: Constants.GET_SECTIONS,
                payload: res
            });
        });
    }
};

