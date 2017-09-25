import Constants   from   "../constants";
export default function (state = null, action) {
    switch (action.type) {
      case Constants.GET_SECTIONS:
        return action.payload.sections;
        break;
    }
    return state;
}