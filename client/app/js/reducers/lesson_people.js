
import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_LESSON_PEOPLE:
        return action.payload.lesson_people;
        break;
    }
    return state;
}