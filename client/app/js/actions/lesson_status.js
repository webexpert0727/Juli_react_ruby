"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export const getLessonStatus = () => {
     return function(dispatch){
        Api.getLessonStatus().then(function(res,err){
            return dispatch({
                type: Constants.GET_LESSON_STATUS,
                payload: res
            });
        });
    }
};

