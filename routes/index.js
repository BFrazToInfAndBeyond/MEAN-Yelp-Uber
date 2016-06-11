var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
        return res.redirect('/pley-rebu');
    }
    var viewModel = {
        title: 'Login',
        error: req.flash('error')
    };
    res.render('index', viewModel);
});

module.exports = router;
