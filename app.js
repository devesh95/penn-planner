/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var session = require('express-session');

var credentials = process.env; // default to production
if (!process.env.PRODUCTION) {
  credentials = require('./credentials.json'); // dev mode
}



// Establish a connection to the mongo instance
var mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost/pennplanner';
mongoose.connect(mongo_uri, function(err) {
  if (err) throw err;
  console.log('Connected to MongoDB');
});



/* Express server config */
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: credentials.COOKIE_SECRET || 'much secure such wow',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// passport config
require('./passport/config').createPassportConfig(passport, credentials);



/* Route handling */
var routes = require('./routes/index');
var api = require('./routes/api');
var data = require('./routes/data');
app.use('/', routes);
app.use('/api', api);
app.use('/data', data);


/* Error handling */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;