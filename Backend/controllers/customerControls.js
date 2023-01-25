const sequelize = require("../config/connections.js")
const { Customer } = require("../models/customer.js")
const { deposit } = require("../models/savings.js")
const { statement } = require("../models/accountStatements.js")
const { withdrawal } = require("../models/withdrawal.js")
const { transfer } = require("../models/transfer.js")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const saltRounds = bcrypt.genSaltSync(10)
const secret = "secret"


const transaction = {
    text: null,
    type: null,
    amount: null,
    date: null
}
let WTransactions = []
const Ttrans = {
    text: null,
    user: null,
    amount: null,
    date: null
}
let transTransactions = []
const register = async(req, res) =>{
    const cus = {cusName: req.body.CustomerName,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, saltRounds)}
    
       
  Customer.findAll({
        where: {
            username: req.body.username
        }
      }).then(rs =>{
        if(rs.length >= 1)
        {
            res.status(200).json([{message:"username taken"}])  
        }
        else
        {
            Customer.create(cus).then(rs=>{
                console.log(rs)
                res.status(200).json([{ message: "data created" }])
            }).catch(err=>{
                console.log(err)
                res.status(403).json([{ message: "err" }])
            })
        }
       
    
    }).catch(err=>{
          console.log(e)
      });
}

const login = async(req,res)=>{
    const  username = req.body.username
    const  password = req.body.password
      Customer.findOne({
          where: {
              username: username
          }
        }).then(rs =>{
       if(rs)
       {
          const validity  =  bcrypt.compareSync(password,rs.dataValues.password)
          if(validity == true){
              const token = jwt.sign(rs.dataValues,secret)
              res.status(200).json([{ message: token}])
          }else{
              res.status(200).json([{ message: "invalid" }]) 
          }
       }else{
          res.status(200).json([{ message: "invalid" }]) 
       }
  
      }).catch(err=>{
            console.log(err)
        });
    }



    
const dashboard =async (req,res)=>{
        let balance = 0.00
        let totaldep = 0.00
        let totalwith = 0.00
        let totaltrans = 0.00

           const customerID = req.decoded.custid
            WTransactions = []
    /* withdrawal object*/
        withdrawal.findAll({
            where: {
            custid: customerID
        },
        order: [["createdAt", "DESC"]]
         }).then(results => {
        if (typeof results === undefined) {
            console.log(results + 'is null')
        } else {
            results.map(result => {
                let wTransaction = Object.create(transaction)
                wTransaction.text = 'Debit transaction'
                wTransaction.type = 'withdrawal'
                wTransaction.amount = result.Amountwithdraw
                wTransaction.date = result.createdAt
                WTransactions.push(wTransaction)
            })
        }
        }).catch(error => {
        console.log(error)
         })

    /* transfer object*/
        transfer.findAll({
        where: {
            custid: customerID
        },
        order: [["createdAt", "DESC"]]
        }).then(results => {
        if (typeof results === undefined) {
            console.log(results + 'is null')
        } else {
            results.map(result => {
                let tTransaction = Object.create(Ttrans)
                tTransaction.text = 'Debit transaction'
                tTransaction.user = result.beneficiaryName
                tTransaction.amount = result.Amounttrans
                tTransaction.date = result.createdAt
                transTransactions.push(tTransaction)
            })
        }
        }).catch(error => {
        console.log(error)
    })

        statement.findOne({
                where: {
                    custid: customerID
                }
            })
                .then(results => {
                    console.log('this is results ' + results)
                    if (results) { 
                        totaldep = results.statementdeposit
                        totaltrans =  results.statementtrans
                        balance = results.totalbal
                        totalwith = results.statementwithdraw
                        res.status(200).json([{ customer: customerID, fullname: req.decoded.cusName,transfers:totaltrans, savings: totaldep, totalwith: totalwith, balance: balance, transactions: WTransactions, Ttransactions:transTransactions }])
                    }
                }).catch(err => {
                    console.log(err)
                })
           }

          
/*Deposit functionality*/
const doDeposit = async (req, res) => {
    const dep={ custid : req.decoded.custid,
        amountdep : req.body.Amount}
    statement.findOne({
        where: {
            custid: custid
        }
    }).then(result => {
        if (amountdep === null) {
            res.status(200).json([{message: 'pls do a deposit'}])
            
        } else {
            deposit.create(dep).then(rs=>{
                statement.update({
                    statementdeposit: result.statementdeposit + parseInt(amountdep),
                    totalbal: result.totalbal + amountdep
                },
                {
                    where: {
                        custid: custid
                    }
                }).then(rs => {
                    res.status(200).json([{ message: 'done deposit & updated statement' }])
                    console.log(rs)
                })
            })
        }
    })
    .catch(err => {
        console.log(err)
    })
}

/* Withdrawal Functionality */
const doWithdrawal = async (req, res) => {
    
    const customerID = req.decoded.custid
    const amount = req.body.Amount
    const pin = req.body.Pin
    const withdraw = {
        Amountwithdraw: amount,
        custid: customerID
    }
    
    statement.findOne({
        where: {
            custid: customerID
        }
    }).then(result => {
        if (result === null) {
            res.status(200).json([{ message: 'pls do a deposit first!' }])
        } else if (amount > result.dataValues.totalbal) {
            console.log('insufficient funds')
            res.status(200).json([{ message: 'insufficient funds' }])
        } else {
            const validity = bcrypt.compareSync(pin, req.decoded.password)
            if (validity === true) {
                withdrawal.create(withdraw)
                    .then(rs => {
                        statement.update({
                            statementwithdraw: (result.statementwithdraw + parseInt(amount)),
                            totalbal: (result.totalbal - amount)
                        },
                            {
                                where: {
                                    custid: customerID
                                }
                            }).then(rs => {
                                res.status(200).json([{ message: 'done withdrawal & updated statement' }])
                                console.log(rs)
                            })
                    })
            } else {
                res.status(200).json([{ message: 'Incorrect pin' }])
            }
        }
    })
        .catch(err => {
            console.log(err)
        })
}
 
const statementCreate = async (customerid) => {
    const newStatement = {
        statementwithdraw: 0,
        statementdeposit: 0,
        statementtrans: 0,
        totalbal: 0,
        custid: customerid
    }

    statement.create(newStatement)
        .then(result => {
            console.log('statement done!')
        }).catch(err => {
            console.log(err)
        })
    return newStatement
}


/*Transfers Functionality */
const doTransfer = async (req, res) => {
    const customerID = req.decoded.custid
    const beneficiaryName = req.body.beneficiaryname
    const amountTrans = req.body.Amount
    const pin = req.body.Pin
    let beneficiaryId
    const trans ={Amounttrans: parseInt(amountTrans),
        custid: customerID,
        beneficiaryName: beneficiaryName}

    Customer.findOne({
        where: {
            username: beneficiaryName
        }
    }).then(result => {
        if (result === null) {
            res.status(200).json([{ message: 'Account does not exist' }])
        } else {
            beneficiaryId = result.custid
            console.log('this is the beneficiary id = ' + beneficiaryId)
            statement.findOne({
                where: {
                    custid: customerID
                }
            }).then(rs => {
                console.log(rs)
                if (rs !== null) {
                    if (amountTrans > rs.totalbal) {
                        res.status(200).json([{ message: 'insufficient funds' }])
                    } else {
                        const validity = bcrypt.compareSync(pin, req.decoded.password)
                        if (validity === true) {
                            transfer.create(trans)
                            .then(async rz => {
                                statement.findOne({
                                    where: {
                                        custid: customerID
                                    }
                                })
                                .then(rs =>{
                                    if (rs) {
                                        statement.update({
                                            statementtrans: rs.statementtrans + rz.Amounttrans,
                                            totalbal: rs.totalbal - rz.Amounttrans
                                        }, {
                                            where: {
                                                custid: rz.custid
                                            }
                                        })
                                        deposit.create({
                                            Amountdep: rz.Amounttrans,
                                            custid: beneficiaryId
                                        })
                                        .then(rs => {
                                            console.log('deposit created is------------' + rs.Amountdep)
                                        
                                        statement.findOne({
                                            where: {
                                                custid: beneficiaryId
                                            }
                                        })
                                        .then(rr => {
                                            if (rr) {

                                                statement.update({
                                                    statementdeposit: rr.statementdeposit + rs.Amountdep,
                                                    totalbal: rr.totalbal + rs.Amountdep//rz.Amounttrans
                                                },
                                                    {
                                                        where: {
                                                            custid: beneficiaryId
                                                        }
                                                    }
                                                )
                                                .then(r => {
                                                    console.log(' this is receiver statement' + r)
                                                    res.status(200).json([{ message: 'Transfer successful' }])
                                                })}
                                                else{
                                                    statementCreate(beneficiaryId)
                                                .then(result => {
                                                    statement.update({
                                                        statementdeposit: result.statementdeposit+rs.Amountdep,
                                                        totalbal: result.totalbal + rs.Amountdep
                                                    },
                                                        {
                                                            where: {
                                                                custid: beneficiaryId
                                                            }
                                                        }
                                                    ).then(result => {
                                                        console.log('....' + result)
                                                        res.status(200).json([{ message: 'Transfer successful' }])
                                                    })
                                                })
                                            }
                                        })    
                                  })


                                    }
                                })
                               })  
                            }
                            else {
                                res.status(200).json([{ message: 'Incorrect Password' }])
                            }
                        }
                        }
                        })
                        .catch(err => {
                            console.log(err)
        })
        }
    })
}


module.exports = {register,login,dashboard,doDeposit,doWithdrawal,doTransfer}
