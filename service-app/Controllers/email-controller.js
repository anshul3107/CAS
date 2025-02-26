const jwt = require('jsonwebtoken');

const serverConfig = require('../serverConfig');
const User = require('../Models/user');
const HttpError = require('../Models/http-error');
const {sendEmail} = require('../Service/emailService');

const generateTokenAndSendEmail = (email, next, mailOptions = {}) => {
    try {
        const token = jwt.sign({email: email}, serverConfig.jwtPrvtKey, {expiresIn: '2h'});
        const mailSubject = mailOptions.subject || 'Email Verification via MyAPI';
        const html =
            (mailOptions.html && mailOptions.html.replace('token', `token=${token}`)) ||
            `Please click on the <a href="${serverConfig.clientAppURL}/verify/token?email=${email}&token=${token}">link</a> to verify your email.`;
        const text =
            (mailOptions.text && mailOptions.text.replace('token', `token=${token}`)) ||
            `Please visit the following link to verify your email: ${serverConfig.clientAppURL}/verify/token?email=${email}&token=${token}`;
        return sendEmail({
            from: serverConfig.fromEmail,
            to: email,
            subject: mailSubject,
            text,
            html
        });
    } catch (err) {
        console.log('generateTokenAndSendEmail', err);
        return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
    }
};

exports.generateTokenAndSendEmail = generateTokenAndSendEmail;

exports.emailVerificationStatus = (req, res, next) => {
    const email = req.query && req.query.email;
    const reqKey = req.headers && req.headers.api_key;
    if (reqKey !== serverConfig.apiKey) {
        return next(new HttpError(401, 'Unauthorised access!'));
    }
    email &&
        User.findOne({email: email})
            .then((result) => {
                if (result) {
                    res.json({email: result.email, isVerified: result.isVerified});
                } else {
                    const newUser = new User({email: email, isVerified: false});
                    newUser
                        .save()
                        .then((result) => {
                            generateTokenAndSendEmail(result.email, next);
                            res.json({email: result.email, isVerified: result.isVerified});
                        })
                        .catch(() => {
                            return next(
                                new HttpError(
                                    500,
                                    "Cannot update in the DB. We're looking in the issue. Please retry in sometime!"
                                )
                            );
                        });
                }
            })
            .catch((err) => {
                return next(
                    new HttpError(500, "Cannot read from the DB. We're looking in the issue. Please retry in sometime!")
                );
            });
};

exports.emailVerificationUpdate = (req, res, next) => {
    const token = (req.query && req.query.token) || '';
    const email = (req.query && req.query.email) || '';
    try {
        const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);
        if (email !== decoded.email) {
            return next(
                new HttpError(
                    400,
                    `Email doesnot match with the Token. Please Do Not alter/modify the verification parameters.`
                )
            );
        }
        User.findOne({email: decoded.email}).then((result) => {
            if (result) {
                if (result.isVerified) {
                    res.json({email: result.email, isVerified: result.isVerified});
                } else {
                    User.findOneAndUpdate({email: decoded.email}, {$set: {isVerified: true}}, {new: true})
                        .then((result) => {
                            if (result) {
                                res.json({email: result.email, isVerified: result.isVerified});
                            } else {
                                return next(new HttpError(400, 'No such User exist having email as ' + decoded.email));
                            }
                        })
                        .catch((err) => {
                            return next(
                                new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!")
                            );
                        });
                }
            } else {
                return next(new HttpError(404, "Specified user doesn't exist!"));
            }
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            email && generateTokenAndSendEmail(email, next);
            return email
                ? next(
                      new HttpError(
                          400,
                          `This Token has expired. A mail has been sent to ${email} with updated token for verification.`
                      )
                  )
                : next(
                      new HttpError(
                          400,
                          'Uh Oh! There seems to be an issue with the Token. One of the Mandatory fields is missing.'
                      )
                  );
        } else if (err.name === 'JsonWebTokenError') {
            return next(new HttpError(400, `Token is invalid. Please Do Not alter/modify the token.`));
        } else {
            return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
        }
    }
};

exports.resendVerificationEmail = (req, res, next) => {
    const email = req.query && req.query.email;
    email && generateTokenAndSendEmail(email, next);
    res.json({email: email, isVerified: false});
};
