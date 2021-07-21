const express = require('express');
const router = express.Router();

const apiController = require('../controller/api');

router.get('/v1/landing-page', apiController.landingPage);

module.exports = router;