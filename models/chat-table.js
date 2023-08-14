const sequelize = require("../utils/database");

const { Sequelize } = require("sequelize").Sequelize;

const Chat = sequelize.define("chat", {
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
  message: {
    type: Sequelize.STRING,
    allownull: false,
  },
  touserId: {
    type: Sequelize.INTEGER,
    allownull: true,
  },
});

module.exports = Chat;
