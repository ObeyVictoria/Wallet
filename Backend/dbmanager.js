const sequelize = require("./config/connections");
const { statement } = require("./models/accountStatements");
const { deposit } = require("./models/savings");
const { transfer } = require("./models/transfer");
const { withdrawal } = require("./models/withdrawal");

sequelize.sync({force:true}).then(rs=>{
    console.log(rs)
}).catch(err=>{
    console.log(err)
})