import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.UPDATE_LESSON:
        return action.payload;
        break;
    }
    return state;
}