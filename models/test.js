var course = require('../models/course')


/*
      Test routine for the PCR wrapper.
 */


var testRoutine = function(coursename, times) {
  var start = Date.now();
  course.courseReviewsByName(coursename, function(err, result) {
    if (err) throw err;
    console.log('[' + times + '] Time taken: ' + (Date.now() - start) + 'ms.');

    // this should be faster because of the cache
    if (times - 1 > 0) {
      testRoutine(coursename, times - 1);
    }
  });
}

console.log('-----------------------');
console.log('Starting test for CIS 197');
console.log('-----------------------');

testRoutine('CIS 197', 10);