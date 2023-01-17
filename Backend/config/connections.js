const Sequelize = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()
const sequelize = new Sequelize(process.env.DATABASE,process.env.DATABASE_USER,"AYOmide100%",{
    dialect:"mysql", host:"localhost"
});


module.exports = sequelize;

/*var mysql = require ('mysql');

var connection = mysql.createConnection
(
    {host:"localhost",
    user:"root",
    password:"AYOmide100%",
})*/