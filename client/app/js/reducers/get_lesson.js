import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_LESSON_DATE_TIME:
        return action.payload.lesson_date_time;
        break;
    }
    return state;
}