const express = require('express');
const router = express.Router();
const singeUpload = require('../middleware/singleUpload');
const multiUpload = require('../middleware/multiUpload');

const adminController = require('../controller/admin');
const adminCategoryController = require('../controller/admin/category');
const adminBankController = require('../controller/admin/bank');
const adminItemController = require('../controller/admin/item');
const adminBookingController = require('../controller/admin/booking');

router.get('/', adminController.dahsboardView);

router.get('/category', adminCategoryController.categoryView);
router.post('/category', adminCategoryController.addCategory);
router.delete('/category', adminCategoryController.deleteCategory);
router.put('/category', adminCategoryController.editCategory);

router.get('/bank', adminBankController.bankView);
router.post('/bank', singeUpload, adminBankController.addBank);
router.delete('/bank', adminBankController.deleteBank);
router.put('/bank', singeUpload, adminBankController.upadateBank);

router.get('/item', adminItemController.itemView);
router.post('/item', multiUpload, adminItemController.itemAdd);
router.delete('/item', adminItemController.itemDelete);
router.get('/item/:id', adminItemController.itemEdit);
router.delete('/item/delete', adminItemController.deleteImage);
router.put('/item/update', multiUpload, adminItemController.updateItem);

// detail facility endpoint
router.get('/item/facility/:id', adminItemController.showFacility);
router.post('/item/facility/:id', singeUpload, adminItemController.addFacility);
router.delete('/item/facility/delete', adminItemController.deleteFacility);
router.put('/item/facility/update', singeUpload, adminItemController.updateFacility);

// detail activity endpoint
router.get('/item/activity/:id', adminItemController.showActivity);
router.post('/item/activity/:id', singeUpload, adminItemController.addActivity);
router.delete('/item/activity/delete', adminItemController.deleteActivity);
router.put('/item/activity/update', singeUpload, adminItemController.updateActivity);


router.get('/admin/booking', multiUpload, adminBookingController.bookingView);

module.exports = router;
