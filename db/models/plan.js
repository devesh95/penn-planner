/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

var mongoose = require('mongoose');
var SemesterSchema = require('./semester').schema;

var planSchema = mongoose.Schema({  
  name: String,
  gradYear: Number,
  semesters: [SemesterSchema]
});

module.exports = mongoose.model('Plan', planSchema);
