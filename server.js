//import dotenv module to access secret variables
require('dotenv').config()
//import express module, used to create the server
const express = require('express');
//import body parser, to handle JSON in request bodys
var bodyParser = require('body-parser');
const http = require('http');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
//create an express app
const app = express();
const User = require('./objects/user.js');
const Database = require('./objects/database.js');
const Random = require('./objects/random.js')
const authenticateToken = require('./middleware/authenticate.js');
var cookieParser = require('cookie-parser');
const user = require('./models/user.js');
app.use(cookieParser());
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
app.get('/', authenticateToken, async function (req, res) {
    if(req.user!=null){
        let following = [];
        let database = await new User().getModel();
        for(ele of req.user.following){
            let name = await database.findById(ele.friend);
            await following.push(name.name);
            
        }
    res.render((__dirname+ '/public/views/dashboard/dashboard.ejs'),{user:req.user,following});
    }
    else{
        res.render(__dirname + '/public/views/notLoggedInPage/notloggedin.ejs');
    }
})

//GET request handler for Signup Page
app.get('/signup', (req, res) => {
    res.status(200).render(__dirname + '/public/views/signup/signup.ejs');
})

//POST request handler for Signup, adds an User to the DB by creating an Object
app.post('/signup', async (req, res) => {
    const user = await new User(req.body);
    let status = await user.createUser();
    if (!status) {
        res.send('You failed to register!')
    } else {
        res.send(`Success!
        <script>
        setTimeout(function () {
           // after 2 seconds
           window.location = "/login";
        }, 2000)
      </script>`);
    }
})

app.get('/login', async (req, res) => {
    res.status(200).render(__dirname + '/public/views/login/login.ejs');
})

app.post('/login', async (req, res) => {
    //authenticate user 
    const {username,password} = req.body;
    let userObj = await new User(req.body);
    let user = await userObj.loginCheck(username, password);
    await userObj.generateToken(user,res);
    
})

app.get('/logout',authenticateToken,async (req,res)=>{
    if(req.user!=null){
        await new User().logout(req.user,req,res);  //polymorphism
        res.redirect('/');
    }
    else{
        res.redirect('/');
    }
})

app.get('/logoutall',authenticateToken,async(req,res)=>{
    if(req.user!=null){
        await new User().logout(req.user,req,res,true);   //polymorphism
        res.redirect('/');
    }
    else{
        res.redirect('/');
    }
})



app.get('/showdb', async (req, res) => {
    let request = await new Database();
    let db = await request.showdb({});
    res.status(200)
    res.type('json');
    res.send("User Database:\n\n" + JSON.stringify(db, null, "\t"))
})


app.get('/addfriends',authenticateToken, async(req,res)=>{
    if(req.user!=null){
        let userClass= new User();
        let database = await userClass.showdb();
        res.render((__dirname+ '/public/views/friends/followfriends.ejs'),{
            user:req.user,
            database,
            makeid: new Random().randomString()
    });
        }
        else{
            res.send('You are not logged in, please login to view content');
        }
})

app.post('/addfriends',authenticateToken,async (req,res)=>{
    let friends = Object.values(req.body);
    let user = req.user;
    friends.forEach(friend=>{
        user.following.push({friend});
    })
    await user.save();
    res.redirect('/');
    
})


app.get('/keepalive', (req,res)=>{
    res.send('Ping Recieved '+Date.now())
    console.log('Ping Recieved '+Date.now());
})

app.listen('3000', () => console.log("Listening to Port 3000"));

setInterval(function(){
    http.get(process.env.hosturl+'/keepalive');
},30000)