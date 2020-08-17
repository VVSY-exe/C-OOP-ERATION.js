//import dotenv module to access secret variables
require('dotenv').config()
//import express module, used to create the server
const express = require('express');
//import body parser, to handle JSON in request bodys
var bodyParser = require('body-parser');
//create an express app
const app = express();
const User = require('./objects/user.js');
const Database = require('./objects/database.js');
//make express use body-parser's json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//set json spaces to 2, used when serving JSON data
app.set('json spaces', 2);
//make public a static directory, to serve static files
app.use(express.static('public'));
//set view engine to ejs, which allows to embed JS into HTML
app.set('view engine', 'ejs');


//GET request handler for homepage
app.get('/', function (req, res) {
    res.status(200).send("You are at the Homepage!");
})

//GET request handler for Signup Page
app.get('/signup', (req, res) => {
    res.status(200).render(__dirname + '/public/views/signup/signup.ejs');
})

//POST request handler for Signup, adds an User to the DB by creating an Object
app.post('/signup', async (req, res) => {
    const user = await new User(req.body);
    let status = await user.createUser();
    console.log(status)
    if(!status){
        res.send('You failed to register!')
    }
    else{
        res.send(`Success!
        <script>
        setTimeout(function () {
           // after 2 seconds
           window.location = "/";
        }, 2000)
      </script>`);
    }
})

app.get('/showdb',async (req,res)=>{
    let request = await new Database();
    let db = await request.showdb();
    res.status(200)
    res.type('json');
    res.send("User Database:\n\n" + JSON.stringify(db, null, "\t"))
})

app.listen('3000', () => console.log("Listening to Port 3000"));