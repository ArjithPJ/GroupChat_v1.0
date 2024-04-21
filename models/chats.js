const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Chats = sequelize.define('chats', {
    sender: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    receiver: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    chat: {
        type: Sequelize.STRING,
        allowNull: false
    },
    time: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: true // Define time as part of the composite primary key
        
    }
});

module.exports = Chats;