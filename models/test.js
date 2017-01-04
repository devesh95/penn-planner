var course = require('../models/course')

course.courseReviewsByName('WRIT 039 302', function(err, result) {
	console.log(result);

});