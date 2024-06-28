const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { route } = require('./campground');
const { storeReturnTo } = require('../middleware');

router.get('/register-form', catchAsync(auth.register));

router.post('/register-user', catchAsync(auth.registerUser));

router.get('/login-form', catchAsync(auth.login));

router.post('/login-user', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login-form' }), catchAsync(auth.loginUser));

router.get('/logout', auth.logout);


module.exports = router;