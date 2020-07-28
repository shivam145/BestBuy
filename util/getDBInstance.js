const Sequelize = require("sequelize");
require("dotenv").config();

const username = process.env["DB_USERNAME "];
const password = process.env["DB_PASSWORD "];

const sequelize = new Sequelize("BestBuy", "root", "$Hiv9426846375", {
    dialect: "mysql",
    host: "localhost",
    logging: false,
});

module.exports = sequelize;
