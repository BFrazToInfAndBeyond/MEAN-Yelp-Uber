var express = require('express');
var restrict = require('../auth/restrict');
var router = express.Router();
var favoriteService = require('../services/favorite-service');
/* GET users listing. */
router.get('/', restrict, function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/api/get-favorites', restrict, function(req, res, next) {
    var email = req.user._doc.email;
    favoriteService.findFavorites(email, function(err, favorites) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(favorites);
    });
});



//use restrict to prevent guests from using this route
router.post('/api/create-favorite', restrict, function(req, res, next) {
    favoriteService.createFavorite(req.body.name, req.user._doc, req.body.location, req.body.yelp_id, function(err, favoriteId) {
        if (err) {
            return res.status(500).json({
                error: 'Failed to create favorite'
            });
        }
        //order_id is a mongo id
        req.session.favorite_id = favoriteId;
        res.json({
            success: true
        });
    });
});

router.delete('/api/delete-favorite/:id', restrict, function(req, res, next) {
    favoriteService.deleteFavorite(req.params.id, req.user._doc, function(err, favoriteId) {
        if (err) {
            return res.status(500).json({
                error: 'Failed to delete favorite'
            });
        }
        //favorite_id is a mongo id
        req.session.favorite_id = favoriteId;
        res.json({
            success: true
        });
    });
});

module.exports = router;