const jwt = require('jsonwebtoken');
const serverConfig = require('../serverConfig');
const User = require('../Models/user');
const Order = require('../Models/order');
const HttpError = require('../Models/http-error');

exports.newOrder = (req, res, next) => {
    const token = req.headers && req.headers.authorization;
    const {name, addressLine1, addressLine2, email, postalCode, country, city, phoneNumber} = req.body;

    try {
        if (name && addressLine1 && email && postalCode && country && city && phoneNumber) {
            const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);

            User.findOne({email: decoded.email}).then((result) => {
                const orderObj = new Order({
                    senderId: result._id,
                    name: name,
                    addressLine1, // another way to assign value with name same as the Key => addressLine1: addressLine1
                    addressLine2,
                    email,
                    postalCode,
                    country,
                    city,
                    phoneNumber
                });

                orderObj
                    .save()
                    .then(
                        res.json({
                            code: 200,
                            message: 'Order placed successfully. Please pay at the time of order pickup.'
                        })
                    )
                    .catch(() => {
                        console.log('newOrder.1', err);
                        return next(
                            new HttpError(
                                500,
                                "Cannot update in the DB. We're looking in the issue. Please retry in sometime!"
                            )
                        );
                    });
            });
        } else {
            console.log('newOrder.2', err);
            return next(new HttpError(400, 'Bad Data. Missing mandatory fields.'));
        }
    } catch (err) {
        console.log('newOrder.3', err);
        if (err.name === 'TokenExpiredError') {
            next(new HttpError(400, 'Uh Oh! Your session seems to have expired. Please login again.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new HttpError(400, 'Uh Oh! There seems to be a problem with the Session. Please login again.'));
        } else {
            return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
        }
    }
};

exports.ordersBySenderId = (req, res, next) => {};

exports.orderByOrderId = (req, res, next) => {};
