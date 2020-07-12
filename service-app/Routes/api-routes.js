const express = require('express');
const emailController = require('../Controllers/email-controller');
const userController = require('../Controllers/user-controller');

const router = express.Router();

router.get('/email/verify-token', emailController.emailVerificationUpdate);

router.post('/user/registration', userController.newUserRegistration);
router.get('/user/profile', userController.getUserProfile);

module.exports = router;
