"use strict";

export default {
  formatErrors(errors) {
    var results = [];
    _.map(errors, function(val, key){
      _.map(val, function(error){
        results.push(key.replace(/[_-]/g, " ") +" "+ error);
      });
    });
    return results;
  }
}