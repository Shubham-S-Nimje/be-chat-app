const sequelize = require("../utils/database");

const { Sequelize } = require("sequelize").Sequelize;

const UserGroup = sequelize.define(
  "usergroup",
  {
    id: {
      type: Sequelize.INTEGER,
      allownull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allownull: false,
    },
    groupId: {
      type: Sequelize.INTEGER,
      allownull: false,
    },
  }
);

module.exports = UserGroup;
