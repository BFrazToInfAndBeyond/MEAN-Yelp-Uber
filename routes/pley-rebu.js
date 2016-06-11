var express = require('express');
var restrict = require('../auth/restrict');
var router = express.Router();

router.get('/', restrict, function(req, res, next) {
    // handled by restrict
    // if(!req.user){ //isAuthenticated()
    //     return res.redirect('/');
    // }
    var viewModel = {
        firstName: req.user ? req.user.firstName : null
    };
  res.render('pley-rebu/index', viewModel);
});

module.exports = router;
