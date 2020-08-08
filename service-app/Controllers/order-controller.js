const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const serverConfig = require('../serverConfig');
const User = require('../Models/user');
const Order = require('../Models/order');
const HttpError = require('../Models/http-error');

AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

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
                        let distanceInMtrs;
                        let courierCost = 7.99;
                        if (json) {
                            distanceInMtrs = json.rows[0].elements[0].distance.value;
                        }
                        courierCost = distanceInMtrs / 10000 > courierCost ? distanceInMtrs / 10000 : courierCost;
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
                            let sqsOrderObj = {
                                MessageAttributes: {
                                    orderId: {
                                        DataType: 'String',
                                        StringValue: order.id
                                    },
                                    senderName: {
                                        DataType: 'String',
                                        StringValue: result.firstName
                                    },
                                    receiverName: {
                                        DataType: 'String',
                                        StringValue: order.name
                                    },
                                    courierCost: {
                                        DataType: 'String',
                                        StringValue: order.charges
                                    }
                                },
                                // MessageBody: 'SQS Order Data',
                                MessageBody: JSON.stringify(
                                    {
                                        orderId: order.id,
                                        senderName: result.firstName,
                                        senderEmail: result.email,
                                        receiverName: order.name,
                                        courierCost: order.charges,
                                        orderDetailsLink: serverConfig.clientAppURL + '/order/details/' + order.id
                                    }),

                                MessageDeduplicationId: order.id,
                                MessageGroupId: 'UserOrders',
                                QueueUrl: serverConfig.sqsQueueUrl
                            };

                            sqs.sendMessage(sqsOrderObj)
                                .promise()
                                .then((data) => {
                                    console.log('SQS Producer Success:', {...data});
                                    res.json({
                                        code: 200,
                                        orderId: order.id,
                                        message:
                                            'Order placed successfully and a confirmation mail will be sent to your email. ' +
                                            'Please pay €' +
                                            courierCost +
                                            ' at the time of order pickup.'
                                    });
                                })
                                .catch((err) => {
                                    console.log('SQS Error:', {err});
                                    return next(
                                        new HttpError(
                                            500,
                                            'Cannot update in the Message Queue. Please retry in sometime!'
                                        )
                                    );
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
            console.log('newOrder.2');
            return next(new HttpError(400, 'Bad Data. Missing mandatory fields.'));
        }
    } catch (err) {
        console.log('newOrder.3 WARNING', err);
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
