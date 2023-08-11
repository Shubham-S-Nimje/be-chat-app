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
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allownull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allownull: false,
  },
  phonenumber: {
    type: Sequelize.INTEGER,
    allownull: false,
  },
});

module.exports = User;
