const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    location: String,
    phoneNumber: String,
    isVerified: {type: Boolean, default: false}
});

userSchema.pre('save', function (next) {
    if (this.password) {
        bcrypt.hash(this.password, 10).then((hashedPassword) => {
            this.password = hashedPassword;
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);
