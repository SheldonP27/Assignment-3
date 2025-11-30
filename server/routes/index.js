var express = require('express');
var router = express.Router();
const passport = require('passport');
let DB = require('../config/db');
let userModel = require('../model/user');
let User = userModel.User;



router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Auto Tracker',
    displayName: req.user ? req.user.displayName : ''
  });
});

router.get('/home', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET Inventory page. */
router.get('/Inventory', function(req, res, next) {
  res.render('cars', { title: 'Inventory',displayName: req.user?req.user.displayName:"" });
});


router.get('/login', function(req, res, next) {
  res.render('login', { 
    title: 'Login',
    displayName: req.user ? req.user.displayName : ''
  });
});

module.exports = router;