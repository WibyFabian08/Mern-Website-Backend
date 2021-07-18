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

router.get('/admin/category', adminCategoryController.categoryView);
router.post('/admin/category', adminCategoryController.addCategory);
router.delete('/admin/category', adminCategoryController.deleteCategory);
router.put('/admin/category', adminCategoryController.editCategory);

router.get('/admin/bank', adminBankController.bankView);
router.post('/admin/bank', singeUpload, adminBankController.addBank);
router.delete('/admin/bank', adminBankController.deleteBank);
router.put('/admin/bank', singeUpload, adminBankController.upadateBank);

router.get('/admin/item', adminItemController.itemView);
router.post('/admin/item', multiUpload, adminItemController.itemAdd);
router.delete('/admin/item', adminItemController.itemDelete);
router.get('/admin/item/:id', adminItemController.itemEdit);
router.delete('/admin/item/delete', adminItemController.deleteImage);
router.put('/admin/item/update', multiUpload, adminItemController.updateItem);

// detail facility endpoint
router.get('/admin/item/facility/:id', adminItemController.showFacility);
router.post('/admin/item/facility/:id', singeUpload, adminItemController.addFacility);
router.delete('/admin/item/facility/delete', adminItemController.deleteFacility);
router.put('/admin/item/facility/update', singeUpload, adminItemController.updateFacility);

// detail activity endpoint
router.get('/admin/item/activity/:id', adminItemController.showActivity);
router.post('/admin/item/activity/:id', singeUpload, adminItemController.addActivity);
router.delete('/admin/item/activity/delete', adminItemController.deleteActivity);
router.put('/admin/item/activity/update', singeUpload, adminItemController.updateActivity);


router.get('/admin/booking', multiUpload, adminBookingController.bookingView);

module.exports = router;
