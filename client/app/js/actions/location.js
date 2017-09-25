"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export const getLocations = () => {
     return function(dispatch){
        Api.getLocations().then(function(res,err){
            return dispatch({
                type: Constants.GET_LOCATIONS,
                payload: res
            });
        });
    }
};

