var PCR = require("pcr");
var async = require("async");

pcr = new PCR("Az_oxUJPPtlMvauTEsmN3YefCPYk_U");

var cache = {};

/**
 * Returns average reviews for a course by course name
 * @param  {String}   	name course name: DEPT XXX
 * @param  {callback} 	cb   provided with err and review
 */
var courseReviewsByName = function(name, cb) {
	var tokens = name.trim().split(' ');
	var dept = tokens[0];
	var coursecode = tokens[1];
	var section = '001'; // default
	if (tokens.length > 2) {
		section = tokens[2];
	}

	if (cache[dept]) {
		var courses = cache[dept]; // retrieve from cache
		var courseId = getCourseIdFromCourseMap(courses, coursecode);
		fetchAverageRating(courseId, cb);
	} else {
		pcr.department(dept, function(err, courses) {
			cache[dept] = courses; // cache result for future queries
			if (!err && courses && courses.result) {
				var courseId = getCourseIdFromCourseMap(courses, coursecode);
				fetchAverageRating(courseId, cb);
			} else {
				cb(err);
			}
		});
	}
};


/**
 * Fetches average rating using a course ID.
 * @param  {String}   courseId CourseID from PCR API
 * @param  {Function} cb       provided with err and rating
 */
var fetchAverageRating = function(courseId, cb) {
	console.log(courseId);
	if (!courseId) {
		cb('Invalid Course ID');
	} else {
		pcr.averageReview(courseId, cb);
	}
}


/**
 * Helper to fetch course ID using course aliases from the PCR data.
 * @param  {Object} courses   	 Course map retrieved from /depts
 * @param  {String} coursecode   Coursecode, eg 'XXX'  
 * @return {String}              Course ID
 */
var getCourseIdFromCourseMap = function(courses, coursecode) {
	for (var course of courses.result.coursehistories) {
		for (var alias of course.aliases) {
			if (alias.endsWith(coursecode)) {
				return course.id;
			}
		}
	}
	return null;
}

module.exports = {
	courseReviewsByName: courseReviewsByName
}