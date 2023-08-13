const sequelize = require("../utils/database");

const { Sequelize } = require("sequelize").Sequelize;

const Admin = sequelize.define("admin", {
  id: {
    type: Sequelize.INTEGER,
    allownull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  groupId: {
    type: Sequelize.STRING,
    allownull: false,
  },
  userId: {
    type: Sequelize.STRING,
    allownull: false,
  },
});

module.exports = Admin;
