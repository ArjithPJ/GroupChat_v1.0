const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

require('dotenv').config();

exports.postLogin = async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const email = req.body.email;
        const password = req.body.password;

    
        const user = await Users.findOne({ where: { email: email } },{ transaction: t});

        if (user) {
            const name = user.name;
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (isPasswordCorrect) {
                const userId = user.id;
                console.log("User id:", userId);

                const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET);
                await t.commit();
                res.status(200).json({ token: token, name: name, message:"User successfully logged in"} );
            } else {
                res.status(401).json({ message: "Incorrect Password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        await t.rollback();
        res.status(500).json({ message: "Internal server error" });
    }
};