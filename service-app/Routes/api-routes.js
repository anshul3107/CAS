const express = require('express');
const emailController = require('../Controllers/email-controller');
const userController = require('../Controllers/user-controller');
const orderController = require('../Controllers/order-controller');

const router = express.Router();

router.get('/email/verify-token', emailController.emailVerificationUpdate);

router.post('/user/registration', userController.newUserRegistration);
router.get('/user/profile', userController.getUserProfile);
router.post('/user/update-password', userController.updatePassword);
router.get('/user/forget-password', userController.forgotPassword);

router.post('/order/new', orderController.newOrder);
router.get('/order/list', orderController.ordersBySenderId);
router.get('/order/details/:orderId', orderController.orderByOrderId);

module.exports = router;
