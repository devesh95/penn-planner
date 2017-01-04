/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

var mongoose = require('mongoose');

// expanded to allow for future integrations
var courseSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Course', courseSchema);