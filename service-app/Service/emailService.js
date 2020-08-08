const AWS = require('aws-sdk');
const sgMail = require('@sendgrid/mail');
const {Consumer} = require('sqs-consumer');

const serverConfig = require('../serverConfig');

AWS.config.update({region: 'us-east-1'});

const sendEmail = (options) => {
    try {
        sgMail.setApiKey(serverConfig.sgKey);
        const msg = {
            to: options.to,
            from: options.from,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        sgMail.send(msg).then(
            (response) => {},
            (error) => {
                console.error('sgMail >>>', error);
                return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
            }
        );
    } catch (err) {
        console.log('sendEmail', err);
        return next(new HttpError(500, "Uh Oh! We're checking the issue. Please retry in sometime!"));
    }
};
exports.sendEmail = sendEmail;

const app = Consumer.create({
    queueUrl: serverConfig.sqsQueueUrl,
    handleMessage: async (message) => {
        console.log(...message);
    },
    sqs: new AWS.SQS({apiVersion: '2012-11-05'})
});

app.on('error', (err) => {
    console.error(err.message);
});
app.on('processing_error', (err) => {
    console.error(err.message);
});
app.start();
