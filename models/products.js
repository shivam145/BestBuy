const Sequelize = require('sequelize');

const sequelize = require('../util/getDBInstance');

const Product = sequelize.define('products', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        item:{
            type:Sequelize.STRING,
            allowNull: false
        },
        price: {
            type:Sequelize.DOUBLE,
            allowNull:false
        },
        imgURL: {
            type:Sequelize.STRING,
            allowNull:false
        },
        description: {
            type:Sequelize.STRING,
            allowNull:false
        }

});

module.exports = Product;