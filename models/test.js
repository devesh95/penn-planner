var course = require('../models/course')


/*
      Test routine for the PCR wrapper.
 */


var testRoutine = function(coursename) {
  console.log('-----------------------\nStarting test for ' + coursename + '\n');
  var start = Date.now();
  course.courseReviewsByName(coursename, function(err, result) {
    console.log(err, result);
    console.log('Time taken: ' + (Date.now() - start) + 'ms.\n');

    // this should be faster because of the cache
    start = Date.now();
    course.courseReviewsByName(coursename, function(err, result) {
      console.log(err, result);
      console.log('Time taken: ' + (Date.now() - start) + 'ms. (Should be much faster than above)\n');
    });
  });
}

testRoutine('CIS 197');
