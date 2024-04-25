const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests', {
  uuid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = ForgotPasswordRequests;