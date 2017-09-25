/*
 * All reducers get two parameters passed in, state and action that occurred
 *       > state isn't entire apps state, only the part of state that this reducer is responsible for
 * */

// "state = null" is set so that we don't throw an error when app first boots up
import Constants   from   "../constants";

export default function (state = null, action) {
    switch (action.type) {
      case 'USER_SELECTED':
        return action.payload;
        break;
      case 'BUTTON_CLICKED':
        return action.payload;
        break;
      case Constants.INVALID_LOGIN:
        return action.payload;
        break;
      case Constants.LOGIN:
        return action.payload;
        break;
      case Constants.REGISTRATION:
        return action.payload;
        break;
      case Constants.INVALID_REGISTRATION:
        return action.payload;
        break;
    }
    return state;
}
