var bcrypt = require('bcrypt');
var User = require('../models/user').User;

exports.addUser = function(user, next) {
    bcrypt.hash(user.password, 10, function(error, hash) {
        if (error) {
            return next(error);
        }

        var newUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email.toLowerCase(),
            password: hash
        });

        newUser.save(function(err) {
            if (err) {
                return next(err);
            }
            next(null);
        });
    });
};

exports.findUser = function(email, next) {
    User.findOne({
        email: email.toLowerCase()
    }, function(err, user) {
        next(err, user);
    });
};