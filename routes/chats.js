const express = require("express");

const chatsController = require('../controllers/chats');
const searchController = require('../controllers/search');

const router = express.Router();

router.get('/getGroups', chatsController.getGroups);
router.get('/getChats', chatsController.getChats);
router.post('/storechat', chatsController.postStoreChat);

router.get('/getUsers', chatsController.getUsers);
router.post('/createGroup', chatsController.postCreateGroup);
router.get('/getMembers', chatsController.getMembers);

router.post('/add-members', searchController.postAddMembers);
router.get('/search-users', searchController.getSearchedUsers);

module.exports = router;