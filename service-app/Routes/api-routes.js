const express = require('express');
const emailController = require('../Controllers/email-controller');
const userController = require('../Controllers/user-controller');

const router = express.Router();

router.get('/email/verify-token', emailController.emailVerificationUpdate);

router.post('/user/registration', userController.newUserRegistration);
router.get('/user/profile', userController.getUserProfile);

router.post('/user/update-password', userController.updatePassword);
router.get('/user/forget-password', userController.forgotPassword);

module.exports = router;
