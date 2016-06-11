var express = require('express');
var restrict = require('../auth/restrict');
var router = express.Router();
var yelpService = require('../services/yelp-service');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//a get as a post, using the body of request to send query params
router.post('/api/search', restrict, function(req, res, next) {
    yelpService.searchYelp(req.body, function(err, results) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(results);
    });
});

module.exports = router;