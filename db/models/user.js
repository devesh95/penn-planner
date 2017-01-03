/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

var mongoose = require('mongoose');

// expanded to allow for future integrations
var userSchema = mongoose.Schema({  
  local: {
    name: String,
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
});

module.exports = mongoose.model('User', userSchema);
