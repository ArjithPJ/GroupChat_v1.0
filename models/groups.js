const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Groups = sequelize.define('groups', {
  group_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  group_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Groups;

