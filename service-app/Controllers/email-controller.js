const sgMail = require('@sendgrid/mail');
const serverConfig = require('../serverConfig');

const emailVerification = (req, res, next) => {
    const email = (req.query && req.query.email) || '';
    res.json({email});
};

const sendEmail = (from, to, subject, body) => {
    sgMail.setApiKey(serverConfig.sendGridKey);
    sgMail.send({
        from,
        to,
        subject,
        text: body.text,
        html: body.html
    });
};

exports.emailVerification = emailVerification;
