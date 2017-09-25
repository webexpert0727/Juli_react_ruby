import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_ENROLLMENT_STATUSES:
        return action.payload.enrollment_statuses;
        break;
    }
    return state;
}
