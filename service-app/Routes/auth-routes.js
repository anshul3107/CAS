const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const userController = require('../Controllers/user-controller');
const serverConfig = require('../serverConfig');
const User = require('../Models/user');

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
            return callback(null, profile);
        }
    )
);
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: `${serverConfig.clientAppURL}/user/login`
    }),
    (req, res) => {
        const userData = req.user._json;
        user = {
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            authToken: jwt.sign({email: userData.email}, serverConfig.jwtPrvtKey, {expiresIn: '2h'})
        };
        res.redirect(`${serverConfig.clientAppURL}/user/socialprofile`);
    }
);

router.get('/socialUserData', (req, res, next) => {
    User.findOne({email: user.email}).then((result) => {
        if (result && result.password) {
            user['isExisting'] = true;
        } else {
            user['isExisting'] = false;
        }
        res.send(user);
    });
});

router.post('/token', userController.userLogin);

module.exports = router;
