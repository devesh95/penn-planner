var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../db/models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/plan', isLoggedIn, function(req, res) {
  var user_id = req.user._id;
  User.findOne(user_id, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.render('plan', {
        user: user,
        semesters: user.plans[0].semesters,
        startYear: user.plans[0].gradYear - (user.plans[0].semesters.length / 2)
      });
    }
  });
});



/* Passport Authentication */
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/plan',
  failureRedirect: '/',
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
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