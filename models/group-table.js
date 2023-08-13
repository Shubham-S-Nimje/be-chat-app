const sequelize = require("../utils/database");

const { Sequelize } = require("sequelize").Sequelize;

const Group = sequelize.define("group", {
  id: {
    type: Sequelize.INTEGER,
    allownull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  grpname: {
    type: Sequelize.STRING,
    allownull: false,
  },
  description: {
    type: Sequelize.STRING,
    allownull: false,
  },
  email: {
    type: Sequelize.STRING,
    allownull: false,
  },
  adminuserId: {
    type: Sequelize.STRING,
    allownull: false,
  },
});

module.exports = Group;
