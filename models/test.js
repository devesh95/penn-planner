var course = require('../models/course')


/*
      Test routine for the PCR wrapper.
 */


var testRoutine = function(coursename, times, done) {
  var start = Date.now();
  course.courseReviewsByName(coursename, function(err, result) {
    if (err) throw err;
    console.log('[' + times + '] Time taken: ' + (Date.now() - start) + 'ms.');

    // this should be faster because of the cache
    if (times - 1 > 0) {
      testRoutine(coursename, times - 1, done);
    } else {
      done();
    }
  });
}

console.log('--------------');
console.log('Starting tests');
console.log('--------------');

var start = Date.now();
testRoutine('CIS 197', 10, function() {
  console.log('Test complete. Total time: ' + (Date.now() - start) + 'ms.\n');

  start = Date.now();
  testRoutine('WRIT 039 302', 10, function() {
    console.log('Test complete. Total time: ' + (Date.now() - start) + 'ms.\n');
  });
});