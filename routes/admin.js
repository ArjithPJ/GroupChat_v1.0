const express = require("express");

const chatsController = require('../controllers/chats');
const searchController = require('../controllers/search');
const adminController = require('../controllers/admin');
const forgotPasswordController = require('../controllers/forgotPassword');
const resetPasswordController = require('../controllers/resetPassword');

const router = express.Router();

router.post('/remove-members', adminController.postRemoveMembers);
router.post('/add-admins',adminController.postAddAdmins);
router.post('/password/forgotpassword', forgotPasswordController.postForgotPassword);

router.get('/password/resetpassword/:uuid', resetPasswordController.getResetPassword);
router.post('/password/resetpassword', resetPasswordController.postResetPassword);

module.exports = router;