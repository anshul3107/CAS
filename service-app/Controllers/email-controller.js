const postmark = require('postmark');
const jwt = require('jsonwebtoken');

const serverConfig = require('../serverConfig');
const User = require('../Models/user');
const HttpError = require('../Models/http-error');

const sendEmail = (options) => {
    const client = new postmark.ServerClient(serverConfig.postmarkKey);
    return client.sendEmail({
        From: options.from,
        To: options.to,
        Subject: options.subject,
        HtmlBody: options.html,
        TextBody: options.text
    });
};

exports.emailVerificationStatus = (req, res, next) => {
    const email = req.query && req.query.email;
    const reqKey = req.headers && req.headers.api_key;
    if (reqKey !== serverConfig.apiKey) {
        return next(new HttpError(401, 'Unauthorised access!'));
    }
    User.findOne({email: email})
        .then((result) => {
            if (result) {
                res.json({email: result.email, isVerified: result.isVerified});
            } else {
                const newUser = new User({email: email, isVerified: false});
                newUser
                    .save()
                    .then((result) => {
                        const token = jwt.sign({email: email}, serverConfig.jwtPrvtKey, {expiresIn: '2h'});
                        const mailSubject = 'Email Verification via MyAPI';
                        const htmlStr =
                            'Please click on the ' +
                            `<a href="http://localhost:${serverConfig.serverPort}/api/email/verify-token?token=${token}">` +
                            'link</a> to verify your email.';
                        const textStr =
                            'Please click on the following link to verify your email. ' +
                            `http://localhost:${serverConfig.serverPort}/api/email/verify-token?token=${token}">`;
                        sendEmail({
                            from: serverConfig.fromEmail,
                            to: result.email,
                            subject: mailSubject,
                            text: textStr,
                            html: htmlStr
                        })
                            .then(() => {
                                res.json({email: result.email, isVerified: result.isVerified});
                            })
                            .catch(() => {
                                return next(
                                    new HttpError(
                                        500,
                                        "Cannot send the Email. We're looking in the issue. Please retry in sometime!"
                                    )
                                );
                            });
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
    try {
        const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);
        User.findOne({email: decoded.email}).then((result) => {
            if (result) {
                if (result.isVerified) {
                    res.json({email: result.email, isVerified: result.isVerified});
                } else {
                    User.findOneAndUpdate({email: decoded.email}, {$set: {isVerified: true}})
                        .then((result) => {
                            res.json({message: 'Email successfully verified'});
                        })
                        .catch((err) => {
                            return next(new HttpError(500, "We're looking in the issue. Please retry in sometime!"));
                        });
                }
            } else {
                return next(new HttpError(404, "Specified user doesn't exist!"));
            }
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new HttpError(400, 'Token has expired. Please generate another token for verification.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new HttpError(400, 'Token is invalid. Please generate another token for verification.'));
        } else {
            return next(new HttpError(500, "We're looking in the issue. Please retry in sometime!"));
        }
    }
};
