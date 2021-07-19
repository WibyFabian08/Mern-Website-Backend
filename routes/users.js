const express = require('express');
const router = express.Router();

const userController = require('../controller/user');

/* GET users listing. */
router.get('/', userController.loginView);
router.get('/register', userController.registerView);
router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);
router.post('/logout', userController.logout);

module.exports = router;
