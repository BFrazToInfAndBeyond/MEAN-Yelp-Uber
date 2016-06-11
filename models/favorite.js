var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    name: String,
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        _id: Schema.Types.ObjectId,
        firstName: String,
        lastName: String,
        email: String,
    },
    location: {
        address: String,
        lat: Number,
        long: Number
    },
    yelp_id: String
});

var Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = {
    Favorite: Favorite
};