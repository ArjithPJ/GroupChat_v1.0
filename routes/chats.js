const express = require("express");

const chatsController = require('../controllers/chats');

const router = express.Router();

router.get('/getChats', chatsController.getChats);
router.post('/storechat', chatsController.postStoreChat);

module.exports = router;