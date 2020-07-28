const Sequelize = require("sequelize");
const sequelize = require("../util/getDBInstance");

const CartItem = sequelize.define("CartItem", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = CartItem;
