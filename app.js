/* tools setup */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var layouts = require('express-ejs-layouts');

/* stock routes */
var index = require('./routes/index');
var ionis = require('./routes/ionis');
var facebook = require('./routes/facebook');
var dashboard = require('./routes/dashboard');

/* tools facebook */
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var config = require('./config/auth');

var app = express();

/* views setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', { layout: 'layout.ejs' });

/* layout setup */
//app.set('layout extractScripts', true)
//app.set('layout extractStyles', true)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

/* facebook */
app.use(passport.initialize());
app.use(passport.session());

/* setup facebook */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy(
  {
    clientID : config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL : config.facebookAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      console.log("inside");
      return (done(null, profile));
    });
  }
));

/* routes setup */
app.use('/', index);
app.use('/fb', facebook);
app.use('/ionis', ionis);
app.use('/dashboard', dashboard);

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* error handler */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
