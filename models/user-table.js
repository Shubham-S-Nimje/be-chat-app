const sequelize = require("../utils/database");

const { Sequelize } = require("sequelize").Sequelize;

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allownull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allownull: false,
  },
  email: {
    type: Sequelize.STRING,
    allownull: false,
  },
  password: {
    type: Sequelize.INTEGER,
    allownull: false,
  },
});

module.exports = User;
