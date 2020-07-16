const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    senderId: String,
    name: {type: String, required: true},
    addressLine1: {type: String, required: true},
    addressLine2: String,
    email: {type: String, required: true},
    postalCode: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    phoneNumber: {type: String, required: true}
});

module.exports = mongoose.model('Order', orderSchema);
