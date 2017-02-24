/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var Mongoose = require('mongoose');
var User = require('../db/models/user');
var DefaultPlan = require('../db/default_plan').plans;

/**
 * Helper to set up passport configurations
 * @param  {object} passport [instance of passport attached to app]
 */
module.exports = {
  createPassportConfig: function(passport, credentials) {

    passport.serializeUser(function(user, done) {
      done(null, user.google.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findOne({
        'google.id': String(id)
      }, function(err, user) {
        done(err, user);
      });
    });

    var googlePassportStrategy = new GoogleStrategy({
        clientID: credentials.GOOGLE_CLIENTID,
        clientSecret: credentials.GOOGLE_CLIENT_SECRET,
        callbackURL: credentials.GOOGLE_CALLBACK
      },
      function(token, refreshToken, profile, done) {
        User.findOne({
          'google.id': profile.id
        }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            console.log('User ' + user.google.email + ' signed in.');
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            newUser.plans = DefaultPlan;
            newUser.save(function(err) {
              if (err)
                throw err;
              console.log('New account created for ' + newUser.google.email);
              return done(null, newUser);
            });
          }
        });
      });

    // use strategies
    passport.use(googlePassportStrategy);

    return passport;
  }
}