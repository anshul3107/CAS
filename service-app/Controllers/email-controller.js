const postmark = require('postmark');
const jwt = require('jsonwebtoken');
const serverConfig = require('../serverConfig');
const User = require('../Models/user');

const emailVerificationStatus = (req, res, next) => {
    const email = (req.query && req.query.email) || '';
    User.findOne({email: email}).then((result) => {
        if (result) {
            res.json({email: result.email, isVerified: result.isVerified});
        } else {
            const newUser = new User({email: email, isVerified: false});
            newUser.save().then((result) => {
                sendEmail({
                    from: 'x19192304@student.ncirl.ie',
                    to: result.email,
                    subject: 'Email Verification via MyAPI',
                    body: 'Please click on below link to verify:'
                }).then(() => {
                    res.json({email: result.email, isVerified: result.isVerified});
                });
            });
        }
    });
};

const sendEmail = (options) => {
    const client = new postmark.ServerClient(serverConfig.postmarkKey);

    return client.sendEmail({
        From: options.from,
        To: options.to,
        Subject: options.subject,
        TextBody: options.body
    });
};

exports.emailVerificationStatus = emailVerificationStatus;
