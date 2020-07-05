const express = require('express');
const emailController = require('../Controllers/email-controller');

const router = express.Router();

router.get('/email/verification', emailController.emailVerificationStatus);
router.get('/email/verify-token', emailController.emailVerificationUpdate);

module.exports = router;
