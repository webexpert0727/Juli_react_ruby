import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_LESSON_STATUS:
        return action.payload.lesson_status;
        break;
    }
    return state;
}