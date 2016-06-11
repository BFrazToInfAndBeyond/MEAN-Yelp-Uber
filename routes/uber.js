var express = require('express');
var restrict = require('../auth/restrict');
var router = express.Router();
var config = require('../config');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
var Uber = require('node-uber');

var uber = new Uber({
    client_id: config.uber.client_id,
    client_secret: config.uber.client_secret,
    server_token: config.uber.server_token,
    redirect_uri: config.uber.redirect_uri,
    name: config.uber.name,
    language: config.uber.language, // optional, defaults to en_US
    sandbox: config.uber.sandbox // optional, defaults to false
});

router.get('/api/products/:lat/:long', restrict, function(req, res, next) {
    uber.products.getAllForLocation(req.params.lat, req.params.long, function(err, results) {
        if (err) {
            console.error(err);
        }
        else {
            res.json(results);
        }
    });
});

router.get('/api/eta-for-location/:lat/:long', function(req, res, next) {
    uber.estimates.getETAForLocation(req.params.lat, req.params.long, function(err, results) {
        if (err) console.error(err);
        else {
            res.json(results);
        }
    });

});


module.exports = router;