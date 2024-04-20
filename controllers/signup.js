const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const sequelize = require('../util/database');
require('dotenv').config();

exports.postSignup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const t = await sequelize.transaction();
    try{
        const existingUser = await Users.findOne({where: {email: email}}, {transaction: t});
        if(existingUser){
            console.log("Account already exists");
            return res.status(409).json({message: "Account already exists"});
        }

        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const newUser = await Users.create({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword, // Store the hashed password
        }, {transaction: t});
        console.log(newUser);
        const token = jwt.sign({id: newUser.id}, process.env.TOKEN_SECRET);

        await t.commit();
        return res.status(201).json({message: "Signup successful", token: token});
    } 
    catch (error) {
        console.error("Error:", error);
        await t.rollback();
        res.status(500).json({ message: "Internal server error" });
    }
};
