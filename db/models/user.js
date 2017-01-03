/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

var mongoose = require('mongoose');
var PlanSchema = require('./plan').schema;

// expanded to allow for future integrations
var userSchema = mongoose.Schema({  
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
  plans: [PlanSchema]
});

module.exports = mongoose.model('User', userSchema);
