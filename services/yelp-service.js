var Yelp = require('yelp');
var config = require('../config');

var yelp = new Yelp({
    consumer_key: config.yelp.consumer_key,
    consumer_secret: config.yelp.consumer_secret,
    token: config.yelp.token,
    token_secret: config.yelp.token_secret
});


exports.searchYelp = function(queryObj, next) {

    // See http://www.yelp.com/developers/documentation/v2/search_api
    // Notes for testing purposes
    //ll=latitude,longitude
    //or
    //location: 'Montreal'
    //example queryObj
    // {
    //     //NOTE: term can be query or by category type
    //         term: 'food',
    //         ll: '39.777953,-94.839726'
    // }
    yelp.search(queryObj)
        .then(function(data) {
            return next(null, data);
        })
        .catch(function(err) {
            console.error(err);
            return next(err);
        });
};
