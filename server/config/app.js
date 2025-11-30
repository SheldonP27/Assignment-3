var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// configuring Databases
let mongoose = require('mongoose');
let DB = require('./db');
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');
let cors = require('cors')
var app = express();
let userModel = require('../model/user');
let User = userModel.User;
// point mongoose to the DB URI
require('dotenv').config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection Error:", err));
  

// Set-up Express Session
app.use(session({
  secret:"Somesecret",
  saveUninitialized:false,
  resave:false
}))
// initialize flash
app.use(flash());
// Make flash messages available in views via res.locals
app.use(function (req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
// user authentication
passport.use(User.createStrategy());
// serialize and deserialize the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// initialize the passport
// Add Google and GitHub strategies before initializing passport so routes/strategies are available
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // Prefer explicit Google-specific callback URL, fall back to a sensible default for local testing
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = new User({
          username: profile.emails[0].value,
          email: profile.emails[0].value,
          displayName: profile.displayName
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // Prefer explicit GitHub-specific callback URL, fall back to a sensible default for local testing
  callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let email = profile.emails && profile.emails[0] ? profile.emails[0].value : profile.username + '@github.com';
      let user = await User.findOne({ username: profile.username });
      if (!user) {
        user = new User({
          username: profile.username,
          email: email,
          displayName: profile.displayName || profile.username
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// initialize the passport
app.use(passport.initialize());
app.use(passport.session());
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
let carRouter = require('../routes/car');
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cars', carRouter);
// auth routes (Google/GitHub)
let authRouter = require('../routes/auth');
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title:'Error'});
});

// (strategies + auth routes are defined earlier)

module.exports = app;
