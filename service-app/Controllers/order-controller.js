const jwt = require('jsonwebtoken');
const serverConfig = require('../serverConfig');
const fetch = require('node-fetch');
const User = require('../Models/user');
const Order = require('../Models/order');
const HttpError = require('../Models/http-error');

exports.newOrder = (req, res, next) => {
    const token = req.headers && req.headers.authorization;
    const {name, addressLine1, addressLine2, email, postalCode, country, city, phoneNumber, cityLocation} = req.body;
    const {distMatrixEndpoint, distMatrixAPIKey} = serverConfig;

    try {
        if (name && addressLine1 && email && postalCode && country && city && phoneNumber) {
            const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);

            User.findOne({email: decoded.email}).then((result) => {
                const senderLocation = result.location;
                const receiverLocation = cityLocation;

                fetch(
                    `${distMatrixEndpoint}?origins=${senderLocation}&destinations=${receiverLocation}&key=${distMatrixAPIKey}`
                )
                    .then((res) => res.json())
                    .then((json) => {
                        let distance;
                        let courierCost = 7.99;
                        if (json) {
                            distance = json.rows[0].elements[0].distance.value;
                        }
                        courierCost = distance / 10000 > courierCost ? distance / 10000 : courierCost;
                        const orderObj = new Order({
                            senderId: result.id,
                            name: name,
                            addressLine1, // another way to assign value with name same as the Key => addressLine1: addressLine1
                            addressLine2,
                            email,
                            postalCode,
                            country,
                            city,
                            location: cityLocation,
                            phoneNumber,
                            charges: courierCost
                        });
                        orderObj.save().then((order) => {
                            res.json({
                                code: 200,
                                orderId: order.id,
                                message: `Order placed successfully. Please pay €${courierCost} at the time of order pickup.`
                            });
                        });
                    })
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

exports.ordersBySenderId = (req, res, next) => {
    const token = req.headers && req.headers.authorization;

    try {
        const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);

        User.findOne({email: decoded.email}).then((user) => {
            if (user) {
                const senderId = user.id;
                Order.find({senderId})
                    .then((orders) => {
                        res.json(
                            orders.map((order) => {
                                return {
                                    orderId: order.id,
                                    orderDate: order.createdAt,
                                    receiverInfo: {
                                        name: order.name,
                                        city: order.city,
                                        country: order.country
                                    }
                                };
                            })
                        );
                    })
                    .catch((err) => {
                        console.log('ordersBySenderId.1', err);
                        return next(
                            new HttpError(
                                500,
                                "Cannot fetch from DB. We're looking in the issue. Please retry in sometime!"
                            )
                        );
                    });
            } else {
                console.log('ordersBySenderId.2');
                return next(new HttpError(400, 'No such User exist having email as ' + decoded.email));
            }
        });
    } catch (err) {
        console.log('ordersBySenderId.3', err);
        if (err.name === 'TokenExpiredError') {
            next(new HttpError(400, 'Uh Oh! Your session seems to have expired. Please login again.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new HttpError(400, 'Uh Oh! There seems to be a problem with the Session. Please login again.'));
        } else {
            return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
        }
    }
};

exports.orderByOrderId = (req, res, next) => {
    const token = req.headers && req.headers.authorization;
    const orderId = req.params && req.params.orderId;
    try {
        const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);

        User.findOne({email: decoded.email}).then((user) => {
            if (user) {
                Order.findById(orderId)
                    .then((order) => {
                        if (order && order.senderId === user.id) {
                            res.json(order);
                        } else {
                            console.log('orderByOrderId.0');
                            return next(new HttpError(400, 'No such Order exist having OrderId as ' + orderId));
                        }
                    })
                    .catch((err) => {
                        console.log('orderByOrderId.1', err);
                        return next(
                            new HttpError(
                                500,
                                "Cannot fetch from DB. We're looking in the issue. Please retry in sometime!"
                            )
                        );
                    });
            } else {
                console.log('orderByOrderId.2');
                return next(new HttpError(400, 'No such User exist having email as ' + decoded.email));
            }
        });
    } catch (err) {
        console.log('orderByOrderId.3', err);
        if (err.name === 'TokenExpiredError') {
            next(new HttpError(400, 'Uh Oh! Your session seems to have expired. Please login again.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new HttpError(400, 'Uh Oh! There seems to be a problem with the Session. Please login again.'));
        } else {
            return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
        }
    }
};
