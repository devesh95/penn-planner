var PCR = require("pcr")

pcr = new PCR("Az_oxUJPPtlMvauTEsmN3YefCPYk_U");

courseReviewsByName = function getReviewsByName(name, cb) {
	pcr.courseHistory(name, function(err, result) {
		if (!err) {
			cb(null, result);
		} else {
			cb(err, null);
		}
	});
}; 

module.exports = {
	courseReviewsByName: courseReviewsByName
}