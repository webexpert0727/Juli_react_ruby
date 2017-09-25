import assign         from "object-assign";

var _settings = {apiUrl: 'localhost:3000/api/v1/'};
// Extend Message Store with EventEmitter to add eventing capabilities
var _current_user = DEFAULT_SETTINGS.user;
function setUser(data) {
  // _settings.csrfToken = data.body.csrf_token;
  // _settings.jwt = data.body.jwt_token;
  _current_user = data;
}

var SettingsStore = assign({}, {
  // Return current settings
  current(){
    return _settings;
  },
  
  setUser(data){
    setUser(data)
  },

  currentUser(){
    return _current_user;
  },

  userRole(){
    return _current_user && _current_user.user_type;
  }

});

export default SettingsStore;
