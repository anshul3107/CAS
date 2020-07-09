const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    addressLine1: String,
    addressLine2: String,
    email: {type: String, required: true, unique: true},
    password: String,
    postalCode: String,
    country: String,
    city: String,
    isVerified: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);
