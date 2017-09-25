import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_LOCATIONS:
        return action.payload.locations;
        break;
    }
    return state;
}