import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_LESSON_HORSES:
        return action.payload.lesson_date_time_horses;
        break;
    }
    return state;
}