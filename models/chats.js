const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Chats = sequelize.define('chats', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    chat: {
        type: Sequelize.STRING,
        allowNull: false
    },
    group_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    time: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: true // Define time as part of the composite primary key
        
    }
});

module.exports = Chats;