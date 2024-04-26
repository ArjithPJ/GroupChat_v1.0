const Users = require('../models/users');
const Chats = require('../models/chats');
const Groups = require('../models/groups');
const GroupMembers = require('../models/groupMembers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

exports.postRemoveMembers = async (req, res, next) => {
    const selectedUserIds = req.body.selectedUserIds;
    const selectedUserNames = req.body.selectedUserNames;
    const currentGroup = req.body.currentGroup;
    const t = await sequelize.transaction();
    try{
        selectedUserIds.forEach(async (selectedUserId)=>{
            await GroupMembers.destroy({
                where:{
                    id: selectedUserId,
                    group_id: parseInt(currentGroup,10)
                }
            }, {transaction: t});
        });
        await t.commit();
        res.status(200).json({success: true, message: "Members removed"});
    }
    catch(error){
        await t.rollback();
        console.error(error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
};

exports.postAddAdmins = async (req, res, next) => {
    const selectedUserIds = req.body.selectedUserIds;
    const selectedUserNames = req.body.selectedUserNames;
    const currentGroup = req.body.currentGroup;
    const t = await sequelize.transaction();
    try{
        selectedUserIds.forEach(async (selectedUserId)=>{
            await GroupMembers.update({admin: true},{
                where:{
                    id: selectedUserId,
                    group_id: currentGroup
                }
            },{transaction: t});

        });
        await t.commit();
        res.status(200).json({message: "New admins added", success: true});
    }
    catch(error){
        await t.rollback();
        console.error(error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
};