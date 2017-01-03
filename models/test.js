var course = require('../models/course')

course.courseReviewsByName('CIS 121', function(err, result) {
	console.log(result);

});