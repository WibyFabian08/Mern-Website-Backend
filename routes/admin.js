const express = require('express');
const router = express.Router();

const adminController = require('../controller/admin');
const adminCategoryController = require('../controller/admin/category');
const adminBankController = require('../controller/admin/bank');
const adminItemController = require('../controller/admin/item');
const adminBookingController = require('../controller/admin/booking');


router.get('/', adminController.dahsboardView);

router.get('/category', adminCategoryController.categoryView);
router.post('/category/add', adminCategoryController.addCategory);
router.delete('/category', adminCategoryController.deleteCategory);
router.put('/category', adminCategoryController.editCategory);

router.get('/bank', adminBankController.bankView);
router.get('/item', adminItemController.itemView);
router.get('/booking', adminBookingController.bookingView);

module.exports = router;
