const express = require('express');
const emailController = require('../Controllers/email-controller');

const router = express.Router();

router.get('/email/verification', emailController.emailVerificationStatus);
router.get('/email/verification/resend', emailController.resendVerificationEmail);

module.exports = router;
