const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const serverConfig = require('../serverConfig');

const router = express.Router();
let user = {};

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((user, callback) => {
    callback(null, user);
});

passport.use(
    new FacebookStrategy(
        {
            clientID: serverConfig.fbAppId,
            clientSecret: serverConfig.fbAppSecretKey,
            callbackURL: serverConfig.fbAppCallbackURL
        },
        (accessToken, refreshToken, profile, callback) => {
            console.log('profile >>>', JSON.stringify(profile));
            user = {...profile};
            return callback(null, profile);
        }
    )
);
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {successRedirect: '/fbLoginSuccess', failureRedirect: '/fbLoginFailure'})
);

module.exports = router;
