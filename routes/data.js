/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

var express = require('express');
var router = express.Router();

var Plan = require('../db/models/plan');
var User = require('../db/models/user');


/**
 * Saves the given state of the logged in user's plan
 */
router.post('/semesters/save', isLoggedIn, function(req, res, next) {
  var user_id = req.user._id;
  if (!req.body.semesters) return res.status(500).send('Missing information');

  var labels = req.body.labels;
  var gradYear = req.body.gradYear;
  var semesters = JSON.parse(req.body.semesters) || [];

  User.findById(user_id, function(err, user) {
    if (err) return res.status(500).send(err);
    else {
      user.plans = [{
        labels: labels,
        gradYear: gradYear,
        semesters: semesters
      }];
      user.save(function(saveErr) {
        if (saveErr) return res.status(500).send(saveErr);
        else return res.send('Saved');
      });
    }
  });
});



/**
 * Middleware to check if a user is logged in with an authenticated session.
 */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

module.exports = router;