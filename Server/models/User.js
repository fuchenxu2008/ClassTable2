var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;