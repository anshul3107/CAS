const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = new mongoose.Schema({
    senderId: String,
    name: {type: String, required: true},
    addressLine1: {type: String, required: true},
    addressLine2: String,
    email: {type: String, required: true},
    postalCode: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    createdAt: {type: String, default: moment().format('DDMMYYYYhhmmss')}
});

module.exports = mongoose.model('Order', orderSchema);
