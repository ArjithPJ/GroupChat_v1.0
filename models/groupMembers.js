const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const GroupMembers = sequelize.define('groupMembers', {
  sl_no: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  group_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  group_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = GroupMembers;

