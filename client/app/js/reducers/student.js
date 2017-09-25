import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_STUDENTS:
        return action.payload.students;
        break;
    }
    return state;
}