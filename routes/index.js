var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/schedule', isLoggedIn, function(req, res) {
  var user = req.user;
  res.render('schedule');
});



/* Passport Authentication */
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/schedule',
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