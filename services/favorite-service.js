var Favorite = require('../models/favorite').Favorite;
var mongodb = require("mongodb");

exports.deleteFavorite = function(id, user, next) {
    Favorite.remove({
        _id: new mongodb.ObjectID(id)
    }, function(err, result) {
        if (!err) {
            return next(null, result);
        }
        console.log(err);
        next(err);
    });
};

exports.findFavorites = function(email, next) {
    Favorite.find({
        'user.email': email.toLowerCase()
    }, function(err, favorite) {
        next(err, favorite);
    });
};

exports.createFavorite = function(name, user, location, yelp_id, next) {

    Favorite.findOne({
        "user.email": user.email,
        "location.lat": location.lat,
        "location.long": location.long
    }, function(err, toUpdate) {
        if (err) {
            console.log(err);
            next(err);
        }

        var fav = new Favorite({
            name: name,
            user: user,
            location: location,
            yelp_id: yelp_id
        });

        if (toUpdate) {
            toUpdate.name = name;
        }
        else {
            toUpdate = fav;
        }

        toUpdate.save(function(err, updated, numberAffected) {
            if (err) {
                console.log(err);
                next(err);
            }
            return next(null, updated, numberAffected);
        });
    });
};