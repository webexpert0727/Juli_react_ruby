import Constants from '../constants';
export default function(state = null, action) {
  switch (action.type) {
    case Constants.GET_HORSES_REPORT:
      return action.payload;
      break;
  }
  return state;
}
