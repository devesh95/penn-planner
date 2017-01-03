var PCR = require("pcr");
var async = require("async");

pcr = new PCR("Az_oxUJPPtlMvauTEsmN3YefCPYk_U");

courseReviewsByName = function getReviewsByName(name, cb) {
	
	var tokens = name.trim().split(' ');
	var dept = tokens[0];
	var coursecode = tokens[1];
	var section;
	if (tokens.length > 2) {
		section = tokens[2];
	}

	pcr.department(dept, function(err, courses) {
		if (!err) {
			courses.result.coursehistories.forEach(function(course) {
				course.aliases.forEach(function(alias) { 
					if (alias.endsWith(coursecode)) {
						pcr.courseHistoryReviews(course.id, function(err, data) {
							if (!err) {
								data.result.values.forEach(function(review) {
									// Process each review here
								})
							}
						});
					}
				});
			});
		}
	});
}; 

module.exports = {
	courseReviewsByName: courseReviewsByName
}