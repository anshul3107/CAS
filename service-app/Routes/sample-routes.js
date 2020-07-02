const express = require('express');
const sampleController = require('../Controllers/sample-controller');

const router = express.Router();

router.get('/', sampleController.sampleMethod);

module.exports = router;
