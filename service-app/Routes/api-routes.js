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

router.get('/cityList', (req, res, next) => {
    res.json([
        {name: 'Dublin', countryISO3: 'IRL', countryISO2: 'IE', population: 1059000, long: '-6.2489', lat: '53.3331'},
        {name: 'Cork', countryISO3: 'IRL', countryISO2: 'IE', population: 188907, long: '-8.4958', lat: '51.8986'},
        {name: 'Limerick', countryISO3: 'IRL', countryISO2: 'IE', population: 90054, long: '-8.6231', lat: '52.6647'},
        {name: 'Galway', countryISO3: 'IRL', countryISO2: 'IE', population: 75594, long: '-9.0488', lat: '53.2724'},
        {name: 'Waterford', countryISO3: 'IRL', countryISO2: 'IE', population: 49275, long: '-7.1119', lat: '52.2583'},
        {
            name: 'DÃºn Dealgan',
            countryISO3: 'IRL',
            countryISO2: 'IE',
            population: 38884,
            long: '-6.4167',
            lat: '54.0004'
        },
        {name: 'Drogheda', countryISO3: 'IRL', countryISO2: 'IE', population: 36533, long: '-6.3478', lat: '53.7193'},
        {name: 'Tralee', countryISO3: 'IRL', countryISO2: 'IE', population: 26384, long: '-9.7167', lat: '52.2667'},
        {name: 'Kilkenny', countryISO3: 'IRL', countryISO2: 'IE', population: 21589, long: '-7.2523', lat: '52.6545'},
        {name: 'Sligo', countryISO3: 'IRL', countryISO2: 'IE', population: 20228, long: '-8.4833', lat: '54.2671'},
        {name: 'Monaghan', countryISO3: 'IRL', countryISO2: 'IE', population: 5937, long: '-6.9667', lat: '54.25'},
        {name: 'Ros ComÃ¡in', countryISO3: 'IRL', countryISO2: 'IE', population: 4860, long: '-8.1833', lat: '53.6333'},
        {name: 'Dunleary', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-6.1286', lat: '53.2925'},
        {name: 'Tallaght', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-6.3411', lat: '53.2878'},
        {name: 'Wicklow', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-6.0494', lat: '52.975'},
        {name: 'Clonmel', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-7.7039', lat: '52.355'},
        {name: 'Wexford', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-6.4575', lat: '52.3342'},
        {name: 'Ennis', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-8.9864', lat: '52.8436'},
        {name: 'Naas', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-6.6669', lat: '53.2158'},
        {name: 'Swords', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-6.2181', lat: '53.4597'},
        {name: 'Trim', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-6.7917', lat: '53.555'},
        {
            name: 'Carrick on Shannon',
            countryISO3: 'IRL',
            countryISO2: 'IE',
            population: 0,
            long: '-8.09',
            lat: '53.9469'
        },
        {name: 'Tullamore', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-7.4889', lat: '53.2739'},
        {name: 'Carlow', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-6.9261', lat: '52.8408'},
        {name: 'Mullingar', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-7.35', lat: '53.5333'},
        {name: 'Longford', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-7.8', lat: '53.7333'},
        {name: 'Castlebar', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-9.3', lat: '53.85'},
        {name: 'Nenagh', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-8.1967', lat: '52.8619'},
        {name: 'An CabhÃ¡n', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-7.3606', lat: '53.9908'},
        {name: 'Port Laoise', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-7.3', lat: '53.0322'},
        {name: 'Lifford', countryISO3: 'IRL', countryISO2: 'IE', population: 0, long: '-7.4836', lat: '54.8319'},
        {name: 'Killarney', countryISO3: 'IRL', countryISO2: 'IE', population: 11902, long: '-9.5167', lat: '52.0504'},
        {name: 'Shannon', countryISO3: 'IRL', countryISO2: 'IE', population: 8781, long: '-8.8641', lat: '52.7038'},
        {name: 'Donegal', countryISO3: 'IRL', countryISO2: 'IE', population: 2513, long: '-8.1167', lat: '54.65'}
    ]);
});

module.exports = router;
