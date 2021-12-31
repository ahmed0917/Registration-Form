const express = require("express")
const dotenv = require("dotenv")
const cors = require('cors');
const app = express();

app.use(express.json());

dotenv.config({path:'./config.env'})
const port = process.env.PORT;

app.use(cors)

// Connect Mongoose
require("./models/userSchema.js");
require("./databse/connectionDB.js");

app.use(express.json());
app.use(require('./router/router'));

// Middleware
const middleware = (req,res,next) =>{
    console.log(`Hello my middleware`)
    next();
}

app.get('/',(req,res)=>{
    res.send(`Hello world from the server`)
})

app.get('/about',middleware,(req,res)=>{
    console.log(`Hello my about`)
    res.send(`Hello about world from the server`)
})

app.get('/contact',(req,res)=>{
    res.send(`Hello contact world from the server`)
})

app.get('/signin',(req,res)=>{
    res.send(`Hello signin contact world from the server`)
})

app.get('/signup',(req,res)=>{
    res.send(`Hello signup contact world from the server`)
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })