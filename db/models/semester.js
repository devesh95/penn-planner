/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

var mongoose = require('mongoose');
var CourseSchema = require('./course').schema;

var semesterSchema = mongoose.Schema({  
  courses: [CourseSchema], // in order
  labels: [String]         // in order
});

module.exports = mongoose.model('Semester', semesterSchema);
