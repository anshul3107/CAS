const express = require('express');
const emailController = require('../Controllers/email-controller');

const router = express.Router();

router.get('/email/verification', emailController.emailVerification);

module.exports = router;
