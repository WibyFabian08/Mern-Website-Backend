var express = require('express');
var router = express.Router();

const adminController = require('../controller/admin');

router.get('/', adminController.dahsboardView);
router.get('/category', adminController.categoryView);
router.get('/bank', adminController.bankView);
router.get('/item', adminController.itemView);
router.get('/booking', adminController.bookingView);

module.exports = router;
