import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_HORSES:
        return action.payload.horses;
        break;
    }
    return state;
}