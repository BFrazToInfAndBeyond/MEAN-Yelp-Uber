var express = require('express');
var router = express.Router();
var userService = require('../services/user-service');
var passport = require('passport');
var config = require('../config');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/create', function(req, res, next) {
    var viewModel = {
        title: 'Create an account'
    };
    res.render('users/create', viewModel);
});

router.post('/create', function(req, res, next) {
    userService.addUser(req.body, function(err) {
        if (err) {
            console.log(err);
            var viewModel = {
                title: 'Create an account',
                input: req.body,
                error: err
            };
            delete viewModel.input.password; //vm.input AND req.body is the same obj
            return res.render('users/create', viewModel);

        }
        req.login(req.body, function(err) {
            res.redirect('/pley-rebu');
        });
    });
});

//use local strategy
//adding middleware before the response
router.post('/login',
    function(req, res, next) {
        req.session.orderId = 123;
        if (req.body.rememberMe) {
            req.session.cookie.maxAge = config.cookieMaxAge;
        }
        next();
    },
    passport.authenticate('local', {

        failureRedirect: '/',
        successRedirect: '/pley-rebu',
        failureFlash: 'Invalid credentials'
    }));


router.get('/logout', function(req, res, next) {
    req.logout();
    //remove properties set on session obj
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;
