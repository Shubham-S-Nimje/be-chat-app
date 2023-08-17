const sequelize = require("../utils/database");

const { Sequelize } = require("sequelize").Sequelize;

const Archive = sequelize.define("archive ", {
  id: {
    type: Sequelize.INTEGER,
    allownull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  groupId: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Archive;
