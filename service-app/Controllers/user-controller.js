const User = require('../Models/user');
const HttpError = require('../Models/http-error');
const jwt = require('jsonwebtoken');
const emailController = require('./email-controller');
const serverConfig = require('../serverConfig');

exports.newUserRegistration = (req, res, next) => {
    const {firstName, lastName, email, password, addressLine1, addressLine2, postalCode, city, country} = req.body;
    try {
        User.findOne({email}).then((result) => {
            if (result) {
                return next(new HttpError(400, 'This Email is already registered with us. Please login instead.'));
            } else if (!(firstName && lastName && email && password && addressLine1 && postalCode && city && country)) {
                return next(new HttpError(400, 'Bad Data. Missing mandatory fields.'));
            } else {
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    addressLine1,
                    addressLine2,
                    postalCode,
                    city,
                    country,
                    password
                });
                newUser
                    .save()
                    .then((result) => {
                        emailController.generateTokenAndSendEmail(result.email, res, next);
                    })
                    .catch((err) => {
                        console.log('newUserRegistration.1', err);
                        return next(
                            new HttpError(
                                500,
                                "Cannot update in the DB. We're looking in the issue. Please retry in sometime!"
                            )
                        );
                    });
            }
        });
    } catch (err) {
        console.log('newUserRegistration.2', err);
        return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
    }
};

exports.userLogin = (req, res, next) => {
    const {email, password} = req.body;
    User.findOne({email: email})
        .then((result) => {
            if (result) {
                if (result.password === password) {
                    res.json({
                        email,
                        name: result.firstName,
                        authToken: jwt.sign({email}, serverConfig.jwtPrvtKey, {expiresIn: '2h'})
                    });
                } else {
                    return next(new HttpError(400, 'Login credentials mismatched! Please check Email and/or Password'));
                }
            } else {
                return next(new HttpError(400, 'User not found!'));
            }
        })
        .catch((err) => {
            console.log('userLogin', err);
            return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
        });
};
