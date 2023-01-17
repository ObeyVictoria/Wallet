const Sequelize = require('sequelize')
const sequelize = require('../config/connections.js')
const { Customer } = require('./customer.js')
const statement = sequelize.define('statement', {
    statementid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    statementwithdraw: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    statementdeposit: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    statementtrans: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },    
    totalbal: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
    },
    custid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
    }

})



module.exports = { statement }