const Sequelize = require('sequelize')
const sequelize = require('../config/connections.js')
const deposit = sequelize.define('deposit',{
    depositid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    Amountdep:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    custid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
    }
})

module.exports = {deposit}