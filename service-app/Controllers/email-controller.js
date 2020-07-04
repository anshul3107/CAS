const sgMail = require('@sendgrid/mail');

const serverConfig = require('../serverConfig');
const User = require('../Models/user');

const emailVerificationStatus = (req, res, next) => {
    const email = (req.query && req.query.email) || '';
    User.findOne({email: email}).then((result) => {
        if (result) {
            res.json({email: result.email, isVerified: result.isVerified});
        } else {
            const newUser = new User({email: email, isVerified: false});
            newUser.save().then((result) => res.json(result));
        }
    });
};

const sendEmail = (from, to, subject, body) => {
    sgMail.setApiKey(serverConfig.sendGridKey);
    return sgMail.send({
        from,
        to,
        subject,
        text: body.text,
        html: body.html
    });
};

exports.emailVerificationStatus = emailVerificationStatus;
