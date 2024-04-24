const express = require("express");

const chatsController = require('../controllers/chats');
const searchController = require('../controllers/search');
const adminController = require('../controllers/admin');

const router = express.Router();

//router.post('/remove-users', adminController.postRemoveUsers);
//router.post('/admin-rights',adminController.postAdminRights);

module.exports = router;