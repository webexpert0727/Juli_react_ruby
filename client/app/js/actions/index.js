"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export const selectUser = (user) => {
    console.log("You clicked on user: ", user.first);
    Api.get(Constants.GET_PAGES, `stores/1/pages`);
    return {
        type: 'USER_SELECTED',
        payload: user
    }
};


export const checkClick = (user) => {
    console.log("You BUTTON_CLICKED on user: ", user.first);
    return {
      type: 'BUTTON_CLICKED',
      payload: user
    }
};
