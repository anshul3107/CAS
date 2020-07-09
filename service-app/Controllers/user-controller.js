const User = require('../Models/user');
const HttpError = require('../Models/http-error');
const emailController = require('./email-controller');

exports.newUserRegistration = (req, res, next) => {
    console.log('REQ BODY >>> ', req.body);
    const {firstName, lastName, email, addressLine1, addressLine2, postalCode, city, country} = req.body;
    try {
        User.findOne({email}).then((result) => {
            if (result) {
                return next(new HttpError(400, 'This Email is already registered with us. Please login'));
            } else if (!(firstName && lastName && email && addressLine1 && postalCode && city && country)) {
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
                    country
                });
                newUser
                    .save()
                    .then((result) => emailController.generateTokenAndSendEmail(result, res, next))
                    .catch(() => {
                        return next(
                            new HttpError(
                                500,
                                "11Cannot update in the DB. We're looking in the issue. Please retry in sometime!"
                            )
                        );
                    });
            }
        });
    } catch (err) {
        return next(new HttpError(500, "We're looking in the issue. Please retry in sometime!"));
    }
};
