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

const emailVerificationStatus = (req, res, next) => {
    const email = (req.query && req.query.email) || '';
    User.findOne({email: email}).then((result) => {
        if (result) {
            res.json({email: result.email, isVerified: result.isVerified});
        } else {
            const newUser = new User({email: email, isVerified: false});
            newUser.save().then((result) => {
                const token = jwt.sign({email: email}, serverConfig.jwtPrvtKey, {expiresIn: '2h'});
                const mailSubject = 'Email Verification via MyAPI';
                const htmlStr =
                    'Please click on the ' +
                    `<a href="http://localhost:${serverConfig.serverPort}/api/email/verify?token=${token}">` +
                    'link</a> to verify your email.';
                const textStr =
                    'Please click on the following link to verify your email. ' +
                    `http://localhost:${serverConfig.serverPort}/api/email/verify?token=${token}">`;
                sendEmail({
                    from: serverConfig.fromEmail,
                    to: result.email,
                    subject: mailSubject,
                    text: textStr,
                    html: htmlStr
                }).then(() => {
                    res.json({email: result.email, isVerified: result.isVerified});
                });
            });
        }
    });
};

exports.emailVerificationStatus = emailVerificationStatus;
