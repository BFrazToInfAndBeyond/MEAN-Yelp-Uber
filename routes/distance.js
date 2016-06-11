var express = require('express');
var restrict = require('../auth/restrict');
var router = express.Router();
var distanceService = require('../services/distance-service');

router.post('/api/get-distance', restrict, function(req, res, next) {
    distanceService.getDistance(req.body, function(err, results) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(results);
    });
});


module.exports = router;