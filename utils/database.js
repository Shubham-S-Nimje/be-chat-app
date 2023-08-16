const { Sequelize } = require("sequelize").Sequelize;
const dotenv = require("dotenv").config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = dotenv.parsed;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: "mysql",
  host: DB_HOST,
});

module.exports = sequelize;