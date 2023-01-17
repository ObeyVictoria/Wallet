const express = require('express');

const app = express()
const port = 3000;

var transactions = [
{text:"Lorem Ipsum is simply dummy text of the printing",
date :"24 June 2020",
due: "Due tomorrow"
},
{text:"Lorem Ipsum is simply dummy text of the printing",
date :"24 June 2020",
due: "Due tomorrow"
},
{text:"Lorem Ipsum is simply dummy text of the printing",
date :"24 June 2020",
due: "Due tomorrow"
},
{text:"Lorem Ipsum is simply dummy text of the printing",
date :"24 June 2020",
due: "Due tomorrow"
}

]

var users =[{username:"Eunice",email:"jacob@gmail.com",balance:500},{username:"",email:""}]
// make styles show 
app.use(express.static('public'));


app.set('view engine','ejs')



app.get('/dashboard',(req,res)=>{ 
 
res.render("index",{users: users,transactions: transactions});
})

app.get('/',(req,res)=>{ 
    res.render("login");
})

app.get('/register',(req,res)=>{ 
    res.render("register");
})

app.listen(port,()=>{
    console.log('server running')
})