var express = require('express');
var router = express.Router();
const passport = require('passport');
let DB = require('../config/db');
let userModel = require('../model/user');
let User = userModel.User;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auto Tracker',
    displayName: req.user?req.user.displayName:""
   });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home',displayName: req.user?req.user.displayName:"" });
});

/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About us',displayName: req.user?req.user.displayName:"" });
});

/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact us',displayName: req.user?req.user.displayName:"" });
});

/* GET Inventory page. */
router.get('/inventory', function(req, res, next) {
  res.render('cars', { title: 'Inventory',displayName: req.user?req.user.displayName:"" });
});
module.exports = router;