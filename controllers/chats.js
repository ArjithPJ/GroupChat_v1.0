const Users = require('../models/users');
const Chats = require('../models/chats');
const Groups = require('../models/groups');
const GroupMembers = require('../models/groupMembers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const socketIo = require('socket.io');

require('dotenv').config();

exports.initializeWebSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected');

        // Handle disconnections
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};



exports.getGroups = async (req, res, next) => {
    try{
        const token = req.query.token;
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const belongedGroups = await GroupMembers.findAll({
            where:{id: decoded.id}
        });
        res.status(200).json({ message:"Groups retrieved", belongedGroups: belongedGroups, success: true});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error", success: false});
    }
};

exports.postStoreChat = async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const message = req.body.message;
        const currentGroup = parseInt(req.body.currentGroup,10);
        const token = req.body.token;
        const time = req.body.time;
        
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        
        const name = await Users.findOne({where:{ id: decoded.id}},{transaction: t});
        await Chats.create({
            id: decoded.id,
            name: name.name,
            chat: message,
            group_id: currentGroup,
            time: time
        }, {transaction: t});
        const chatList = await Chats.findAll({transaction: t});
        
        // Get the initialized WebSocket server instance
        const io = req.app.locals.socketio; // Access io from app.locals

        // Emit postStoreChat event to trigger frontend function
        io.emit('fetchChats');
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
    const token = req.query.token;
    const group_id=req.query.group_id;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    try{
        const isAdmin = await GroupMembers.findOne({
            where:{
                id: decoded.id,
                group_id: group_id
            }
        });
        const chats = await Chats.findAll({
            where:{
                group_id: group_id
            }
        });
        const group_name = await Groups.findOne({
            where: {
                group_id: group_id
            }
        });
        console.log("Groups:", group_name);
        
        res.status(200).json({ message: "Chats successfully retrieved", chats: chats, success: true, currentGroup: group_id, currentGroupName: group_name.group_name, isAdmin: isAdmin.admin});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error", success: false});
    }
};

exports.getUsers = async(req, res, next) => {
    try{
        const users = await Users.findAll();
        console.log("Users:", users);

        res.status(200).json({users: users, success: true, message:"Users found"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success: false, message:"Users not found"});
    }
};

exports.postCreateGroup = async (req, res, next) => {
    const groupName = req.body.groupName;
    const userList = req.body.selectedUsers;
    const usernames = req.body.selectedUsernames;
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", userList, usernames);
    const t = await sequelize.transaction();
    try{
        const id = decoded.id;
        const group=await Groups.create({
            group_name: groupName
        },{transaction: t});

        for(let i=0; i< userList.length; i++){
            const user = userList[i];
            const username = usernames[i];
            
            if(parseInt(user,10)=== parseInt(id,10)){
                await GroupMembers.create({
                    group_id: group.group_id,
                    group_name: group.group_name,
                    id: user,
                    name: username,
                    admin: true
                },{ transaction: t});
            }
            else{
                await GroupMembers.create({
                    group_id: group.group_id,
                    group_name: group.group_name,
                    id: user,
                    name: username,
                    admin: false
                },{ transaction: t});
            }
        }
        const belongedGroups = await GroupMembers.findAll({
            where: {
                id: id
            }
        },{ transaction: t});
        await t.commit();
        res.status(200).json({message:"Group created", belongedGroups: belongedGroups, success: true});
    }
    catch(error){
        console.log(error);
        await t.rollback();
        res.status(500).json({message: "Error in creating group", success: false});
    }
};

exports.getMembers = async (req, res, next) => {
    const group_id = req.query.group_id;
    try{
        const users= await GroupMembers.findAll({where:
        {
            group_id: group_id
        }});
        res.status(200).json({users: users, success: true});
    }
    catch(error){
        res.status(500).json({success:false});
    }
};


