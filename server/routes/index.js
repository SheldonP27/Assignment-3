var express = require('express');
var router = express.Router();
const passport = require('passport');
let DB = require('../config/db');
let userModel = require('../model/user');
let User = userModel.User;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home',
    displayName: req.user?req.user.displayName:""
   });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home',displayName: req.user?req.user.displayName:"" });
});

/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About us',displayName: req.user?req.user.displayName:"" });
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('index', { title: 'Products',displayName: req.user?req.user.displayName:"" });
});

/* GET Services page. */
router.get('/services', function(req, res, next) {
  res.render('index', { title: 'Services',displayName: req.user?req.user.displayName:"" });
});

/* GET home page. */
router.get('/contact', function(req, res, next) {
  res.render('index', { title: 'Contact us',displayName: req.user?req.user.displayName:"" });
});

module.exports = router;