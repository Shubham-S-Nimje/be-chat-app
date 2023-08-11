const { Sequelize } = require("sequelize").Sequelize;

const sequelize = new Sequelize("chatapp", "root", "2112", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
