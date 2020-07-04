const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    isVerified: {type: Boolean, require: true}
});

module.exports = mongoose.model('User', userSchema);
