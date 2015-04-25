var passportStrategies = require('./passportStrategies.js'); 
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(app, passport){
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('login', passportStrategies.localSignup);
    passport.use('signup', passportStrategies.localLogin);
}   
