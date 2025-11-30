var express = require('express');
var router = express.Router();
const passport = require('passport');

// Google Auth Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', (req, res, next) => {
  // Custom callback to log provider errors and show them to the user via flash
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      req.flash('error', 'Google authentication error: ' + (err.message || 'unknown'));
      return res.redirect('/login');
    }
    if (!user) {
      console.warn('Google OAuth failed:', info);
      req.flash('error', 'Google login failed. ' + (info && info.message ? info.message : ''));
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login after Google auth failed:', err);
        req.flash('error', 'Login failed after Google authentication.');
        return res.redirect('/login');
      }
      return res.redirect('/cars');
    });
  })(req, res, next);
});

// GitHub Auth Routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback', (req, res, next) => {
  // Custom callback to log provider errors and show them to the user via flash
  passport.authenticate('github', (err, user, info) => {
    if (err) {
      console.error('GitHub OAuth error:', err);
      req.flash('error', 'GitHub authentication error: ' + (err.message || 'unknown'));
      return res.redirect('/login');
    }
    if (!user) {
      console.warn('GitHub OAuth failed:', info);
      req.flash('error', 'GitHub login failed. ' + (info && info.message ? info.message : ''));
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login after GitHub auth failed:', err);
        req.flash('error', 'Login failed after GitHub authentication.');
        return res.redirect('/login');
      }
      return res.redirect('/cars');
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;