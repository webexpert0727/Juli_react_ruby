import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_INSTRUCTORS:
        return action.payload.instructors;
        break;
    }
    return state;
}