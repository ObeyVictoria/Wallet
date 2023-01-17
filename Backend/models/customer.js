const Sequelize = require("sequelize")
const sequelize = require("../config/connections.js")

const Customer = sequelize.define("customer",{
    custid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    cusName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    username:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.TEXT,
        allowNull:false
    }

})

module.exports = {Customer}