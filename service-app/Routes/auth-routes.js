const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const userController = require('../Controllers/user-controller');
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
            callbackURL: serverConfig.fbAppCallbackURL,
            profileFields: ['email', 'name']
        },
        (accessToken, refreshToken, profile, callback) => {
            console.log('profile >>>', JSON.stringify(profile));
            console.log('profile >>>', {...profile});
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

router.post('/token', userController.userLogin);

module.exports = router;
