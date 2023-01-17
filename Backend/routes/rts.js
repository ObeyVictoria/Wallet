const express = require("express")
const { register,login,dashboard,doDeposit,doWithdrawal,doTransfer } = require('../controllers/customerControls.js')
const { verifyAuth } = require('../middleware/auth.js');
const routeManager = express.Router()

//routeManager.get('/', register)
routeManager.post("/registerCustomer",register)
routeManager.post('/Auth',login)
routeManager.put('/deposit',verifyAuth, doDeposit)
routeManager.put('/withdrawal',verifyAuth, doWithdrawal)
routeManager.post('/transfer',verifyAuth, doTransfer)
routeManager.post('/dashboard',verifyAuth,dashboard)

module.exports = {routeManager}