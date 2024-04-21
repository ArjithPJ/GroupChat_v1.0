const Users = require('../models/users');
const Chats = require('../models/chats');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

require('dotenv').config();

exports.postStoreChat = async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const message = req.body.message;
        const token = req.body.token;
        const time = req.body.time;
        console.log(token);
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded.id, message);
        await Chats.create({
            id: decoded.id,
            chat: message,
            time: time
        }, {transaction: t});
        const chatList = await Chats.findAll({ where: { id: decoded.id}}, {transaction: t});
        await t.commit();
        res.status(200).json({message: "Chats successfully added", chats: chatList, success: true});
    }
    catch(error){
        console.error(error);
        await t.rollback();
        res.status(500).json({message: "Chats not updated", success: false});
    }
};

exports.getChats = async(req, res, next) => {
    const t = await sequelize.transaction();
    const token = req.query.token;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    try{
        const chats = await Chats.findAll({where: {id: decoded.id}},{transaction: t});
        console.log("Chats: ", chats);
        await t.commit();
        res.status(200).json({ message: "Chats successfully retrieved", chats: chats, success: true});
    }
    catch(error){
        await t.rollback();
        res.status(500).json({message:"Internal Server Error", success: false});
    }
};