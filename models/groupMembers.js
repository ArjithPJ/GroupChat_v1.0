const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const GroupMembers = sequelize.define('groupMembers', {
  group_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
    
  }
});

module.exports = GroupMembers;

