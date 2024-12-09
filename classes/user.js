const mongoose = require('mongoose');
const user = mongoose.Schema({
        name: String,
        email: String,
        password: String,
	score: Number
});

module.exports = mongoose.model('User', user);
