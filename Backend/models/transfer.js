const Sequelize = require('sequelize')
const sequelize = require('../config/connections.js')
const transfer = sequelize.define('transfer',{
    transferid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    Amounttrans:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    beneficiaryName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    custid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
    }
  
})

module.exports = { transfer }