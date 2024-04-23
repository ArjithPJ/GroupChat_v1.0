const express = require("express");

const chatsController = require('../controllers/chats');

const router = express.Router();

router.get('/getGroups', chatsController.getGroups);
router.get('/getChats', chatsController.getChats);
router.post('/storechat', chatsController.postStoreChat);

router.get('/getUsers', chatsController.getUsers);
router.post('/createGroup', chatsController.postCreateGroup);

module.exports = router;