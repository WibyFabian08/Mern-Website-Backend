const express = require('express');
const router = express.Router();
const singeUpload = require('../middleware/singleUpload');

const apiController = require('../controller/api');

router.get('/v1/landing-page', apiController.landingPage);
router.get('/v1/detail-page/:id', apiController.detailItem);
router.post('/v1/booking', singeUpload, apiController.booking);

module.exports = router;