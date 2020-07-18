const User = require('../Models/user');
const HttpError = require('../Models/http-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailController = require('./email-controller');
const serverConfig = require('../serverConfig');

exports.newUserRegistration = (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        addressLine1,
        addressLine2,
        postalCode,
        city,
        country,
        phoneNumber
    } = req.body;
    try {
        User.findOne({email}).then((result) => {
            if (result) {
                if (!result.password) {
                    bcrypt.hash(password, 10).then((hashedPassword) => {
                        User.findOneAndUpdate(
                            {email: email},
                            {
                                $set: {
                                    firstName: firstName,
                                    lastName: lastName,
                                    password: hashedPassword,
                                    addressLine1: addressLine1,
                                    addressLine2: addressLine2,
                                    postalCode: postalCode,
                                    city: city,
                                    country: country,
                                    phoneNumber: phoneNumber
                                }
                            },
                            {new: true}
                        )
                            .then(
                                res.json({
                                    code: 201,
                                    message: 'User successfully registered.'
                                })
                            )
                            .catch(() => {
                                console.log(err);
                            });
                    });
                } else
                    return next(new HttpError(400, 'This Email is already registered with us. Please login instead.'));
            } else if (
                !(
                    firstName &&
                    lastName &&
                    email &&
                    password &&
                    addressLine1 &&
                    postalCode &&
                    city &&
                    country &&
                    phoneNumber
                )
            ) {
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
                    password,
                    phoneNumber
                });
                newUser
                    .save()
                    .then((result) => {
                        emailController.generateTokenAndSendEmail(result.email, next);
                        res.json({code: 200, message: 'Email Sent successfully.'});
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
                bcrypt.compare(password, result.password).then((isMatch) => {
                    if (isMatch) {
                        res.json({
                            email,
                            name: result.firstName,
                            authToken: jwt.sign({email}, serverConfig.jwtPrvtKey, {expiresIn: '2h'})
                        });
                    } else {
                        return next(
                            new HttpError(400, 'Login credentials mismatched! Please check Email and/or Password')
                        );
                    }
                });
            } else {
                return next(new HttpError(400, 'User not found!'));
            }
        })
        .catch((err) => {
            console.log('userLogin', err);
            return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
        });
};

exports.getUserProfile = (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);

        User.findOne({email: decoded.email})
            .then((result) => {
                if (result) {
                    res.json(result);
                } else {
                    console.log('getUserProfile.1');
                    return next(new HttpError(400, 'No such User exist having email as ' + decoded.email));
                }
            })
            .catch((err) => {
                console.log('getUserProfile.2', err);
                return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
            });
    } catch (err) {
        console.log('getUserProfile.3', err);
        if (err.name === 'TokenExpiredError') {
            next(new HttpError(400, 'Uh Oh! Your session seems to have expired. Please login again.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new HttpError(400, 'Uh Oh! There seems to be a problem with the Session. Please login again.'));
        } else {
            return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
        }
    }
};

exports.updatePassword = (req, res, next) => {
    const token = req.headers.authorization;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const action = req.query.action;
    const qEmail = req.query.email;
    const qToken = req.query.token;

    try {
        if (action === 'change') {
            const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);
            User.findOne({email: decoded.email})
                .then((result) => {
                    if (result) {
                        if (action === 'change') {
                            bcrypt.compare(currentPassword, result.password).then((isMatch) => {
                                if (isMatch) {
                                    bcrypt.hash(newPassword, 10).then((hashedPassword) => {
                                        User.findOneAndUpdate(
                                            {email: decoded.email},
                                            {$set: {password: hashedPassword}}
                                        ).then(() => {
                                            res.json({
                                                code: 200,
                                                message: 'Your password has been successfully updated!'
                                            });
                                        });
                                    });
                                } else {
                                    return next(
                                        new HttpError(400, 'Your current password is incorrect! Please fill-in again')
                                    );
                                }
                            });
                        }
                    } else {
                        return next(new HttpError(400, 'No such User exist having email as ' + decoded.email));
                    }
                })
                .catch((err) => {
                    console.log('updatePassword.1', err);
                    return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
                });
        } else if (action === 'reset') {
            const decoded = jwt.verify(qToken, serverConfig.jwtPrvtKey);
            if (qEmail !== decoded.email) {
                return next(
                    new HttpError(
                        400,
                        `Email doesnot match with the Token. Please Do Not alter/modify the verification parameters.`
                    )
                );
            } else {
                bcrypt.hash(newPassword, 10).then((hashedPassword) => {
                    User.findOneAndUpdate({email: qEmail}, {$set: {password: hashedPassword}}).then((result) => {
                        if (result) {
                            res.json({code: 200, message: 'Your password has been successfully updated!'});
                        } else {
                            return next(new HttpError(400, 'No such User exist having email as ' + qEmail));
                        }
                    });
                });
            }
        }
    } catch (err) {
        console.log('updatePassword.2', err);
        if (err.name === 'TokenExpiredError') {
            next(new HttpError(400, 'Uh Oh! Your session seems to have expired. Please reset again.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new HttpError(400, 'Uh Oh! There seems to be a problem with the Session. Please reset again.'));
        } else {
            return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
        }
    }
};

exports.forgotPassword = (req, res, next) => {
    const email = req.query.email;

    emailController.generateTokenAndSendEmail(email, next, {
        subject: 'Reset your Password',
        html: `Please click on the <a href="${serverConfig.clientAppURL}/account/password?action=reset&email=${email}&token">link</a> to reset your password.`,
        text: `Please visit the following link to reset your password: ${serverConfig.clientAppURL}/account/password?action=reset&email=${email}&token`
    });
    res.json({code: 200, message: `To Reset your password. Please follow instructions sent to your email '${email}'`});
};
