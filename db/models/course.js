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
  credit: {
    type: Number,
    required: true,
    default: 1
  },
  label: String
});

module.exports = mongoose.model('Course', courseSchema);