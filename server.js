//import dotenv module to access secret variables
require('dotenv').config()
//import express module, used to create the server
const express = require('express');
//import body parser, to handle JSON in request bodys
var bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
//create an express app
const app = express();
const User = require('./objects/user.js');
const Database = require('./objects/database.js');
const userdb = require('./models/user.js');
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
    let db = new User({"boomer": "lord"});
    res.status(200).send(db);
    db.getData().boomer = "nopb"
    console.log(db.getData());

})

//GET request handler for Signup Page
app.get('/signup', (req, res) => {
    res.status(200).render(__dirname + '/public/views/signup/signup.ejs');
})

//POST request handler for Signup, adds an User to the DB by creating an Object
app.post('/signup', async (req, res) => {
    const user = await new User (req.body);
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

app.get('/login', async(req, res) => {
    res.status(200).render(__dirname+'/public/views/login/login.ejs');
})

app.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { username, password } = req.body;
        const user = await new User().findExisting(username, CryptoJS.AES.encrypt(password, secretKey));
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        const token = await new user.generateAuthToken();
        console.log("h"+ user, token)
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
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