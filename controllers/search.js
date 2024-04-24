const Users = require('../models/users');
const Chats = require('../models/chats');
const Groups = require('../models/groups');
const GroupMembers = require('../models/groupMembers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const {Op} = require('sequelize');

exports.getSearchedUsers = async(req, res, next) => {
    try{
        const input = req.query.searchInput;
        const users = await Users.findAll({
            where: {
                name: {
                    [Op.like]: `${input}%`
                }
            }
        });
        console.log("UsersL", users);
        res.status(200).json({users: users});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.postAddMembers = async (req, res, next) => {
    const memberIds = req.body.memberIds;
    const memberNames = req.body.memberNames;
    const currentGroup = req.body.currentGroup;
    const currentGroupName = req.body.currentGroupName;

    const t = await sequelize.transaction();
    try {
        for (let i = 0; i < memberIds.length; i++) {
            let memberId = memberIds[i];
            let memberName = memberNames[i];
            
            // Check if the member already exists in the group
            const existingMember = await GroupMembers.findOne({
                where: {
                    id: memberId,
                    group_id: currentGroup
                },
                transaction: t
            });

            // If the member doesn't exist, add them to the group
            if (!existingMember) {
                await GroupMembers.create({
                    group_id: parseInt(currentGroup, 10),
                    group_name: currentGroupName,
                    id: memberId,
                    name: memberName,
                    admin: false
                }, { transaction: t });
            }
        }
            
        await t.commit();
        res.status(200).json({ message: "Successfully added to the group", success: true });
    } catch (error) {
        console.error(error);
        await t.rollback();
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};