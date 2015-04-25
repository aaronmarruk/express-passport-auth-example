var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
    password: String,
    avatar: String
});

mongoose.model('User', UserSchema);