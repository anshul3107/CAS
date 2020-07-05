const postmark = require('postmark');
const jwt = require('jsonwebtoken');

const serverConfig = require('../serverConfig');
const User = require('../Models/user');

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
        res.status(401).json({message: 'Unauthorised access!'});
    } else {
        User.findOne({email: email})
            .then((result) => {
                if (result) {
                    if (result.isVerified) {
                        res.json({message: 'User has already verified this email id'});
                    } else {
                        res.json({email: result.email, isVerified: result.isVerified});
                    }
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
                                    res.json({
                                        message:
                                            "Cannot send the Email. We're looking in the issue. Please retry in sometime!"
                                    });
                                });
                        })
                        .catch(() => {
                            res.json({
                                message:
                                    "Cannot update in the DB. We're looking in the issue. Please retry in sometime!"
                            });
                        });
                }
            })
            .catch((err) => {
                res.json({message: "We're looking in the issue. Please retry in sometime!"});
            });
    }
};

exports.emailVerificationUpdate = (req, res, next) => {
    const token = (req.query && req.query.token) || '';
    try {
        const decoded = jwt.verify(token, serverConfig.jwtPrvtKey);
        User.findOne({email: decoded.email}).then((result) => {
            if (result) {
                if (result.isVerified) {
                    res.json({message: 'User has already verified this email id'});
                } else {
                    User.findOneAndUpdate({email: decoded.email}, {$set: {isVerified: true}})
                        .then((result) => {
                            res.json({message: 'Email successfully verified'});
                        })
                        .catch((err) => {
                            res.json({message: "We're looking in the issue. Please retry in sometime!"});
                        });
                }
            } else {
                res.json({message: "Specified user doesn't exists!"});
            }
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.json({message: 'Verification Token has expired. Please generate another token for verification.'});
        } else if (err.name === 'JsonWebTokenError') {
            res.json({message: 'Token is invalid. Please generate another token for verification.'});
        } else {
            res.json({message: "We're looking in the issue. Please retry in sometime!"});
        }
    }
};
