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
const Post = require('./objects/post.js');
const Random = require('./objects/random.js')
const authenticateToken = require('./middleware/authenticate.js');
var cookieParser = require('cookie-parser');
const user = require('./models/user.js');
const posts = require('./models/posts.js');
app.use(cookieParser());
//make express use body-parser's json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var fileupload = require('express-fileupload');
app.use(fileupload());
var Profilephotos = require('./objects/profilephotos.js');
const post = require('./objects/post.js');
//set json spaces to 2, used when serving JSON data
app.set('json spaces', 2);
//make public a static directory, to serve static files
app.use(express.static('public'));
//set view engine to ejs, which allows to embed JS into HTML
app.set('view engine', 'ejs');


//GET request handler for homepage
//OOPs impelemented
app.get('/', authenticateToken, async function (req, res) {
    if (req.user != null) {
        let obj = await new User().getDashboard(req);
        res.render((__dirname + '/public/views/dashboard/dashboard.ejs'), {
            user: obj.user,
            following: obj.following,
            profilephoto: obj.profilephoto,
            post: obj.post,
        });
    } else {
        res.render(__dirname + '/public/views/notLoggedInPage/notloggedin.ejs');
    }
})

//GET request handler for Signup Page
//OOPs not needed
app.get('/signup', (req, res) => {
    res.status(200).render(__dirname + '/public/views/signup/signup.ejs');
})

//POST request handler for Signup, adds an User to the DB by creating an Object
//object oriented
app.post('/signup', async (req, res) => {
    const user = await new User(req.body);
    let status = await user.createUser(req);
    if (!status) {
        res.send('You failed to register! Please make sure you entered all the data.')
    } else {
        res.send(`Success!
        <script>
        setTimeout(function () {
           // after 2 seconds
           window.location = "/login";
        }, 1500)
      </script>`);
    }
})

app.get('/login', async (req, res) => {
    res.status(200).render(__dirname + '/public/views/login/login.ejs');
})

app.post('/login', async (req, res) => {
    //authenticate user 
    const {
        username,
        password
    } = req.body;
    let userObj = await new User(req.body);
    let user = await userObj.loginCheck(username, password);
    await userObj.generateToken(user, res);

})

//OOPs implemented
app.get('/logout', authenticateToken, async (req, res) => {
    if (req.user != null) {
        await new User().logout(req.user, req, res); //polymorphism
        res.redirect('/');
    } else {
        res.redirect('/');
    }
})

//OOPs implemented
app.get('/logoutall', authenticateToken, async (req, res) => {
    if (req.user != null) {
        await new User().logout(req.user, req, res, true); //polymorphism
        res.redirect('/');
    } else {
        res.redirect('/');
    }
})



app.get('/showdb', async (req, res) => {
    let db = await new User().showdb('User', {});
    res.status(200)
    res.type('json');
    res.send("User Database:\n\n" + JSON.stringify(db, null, "\t"))
})

//OOPs Implemented
app.get('/users', authenticateToken, async (req, res) => {
    if (req.user != null) {
        let obj = await new User().getFollowingList(req);
        res.render(__dirname + '/public/views/users/users.ejs', {
            users: obj.users,
            user: obj.user,
            profilepic: obj.profilepic,
            following: obj.following
        });
    }
    else{
        res.redirect('/');
    }
})

//OOPs Implemented
app.post('/follow/:id', authenticateToken, async (req, res) => {
    if (req.user != null) {
        await new User().followUser(req,res); 
    } else {
        res.redirect('/login')
    }
})


//Implemented OOPs
app.get('/post', authenticateToken, async (req, res) => {
    if (req.user != null) {
        let userdb= new User().showdb('user',{});
        userdb = JSON.stringify(userdb);
        let timeline = await new User().getTimeline(req.user);
        res.render(__dirname + '/public/views/posts/post.ejs', {
            post: timeline['post'],
            by: timeline['by'],
            profilepic: timeline['profilepic'],
            user: req.user,
            userdb
        });
    } else {
        res.render(__dirname + '/public/views/notLoggedInPage/notloggedin.ejs');
    }
})


//Implement OOPs
app.post('/post', authenticateToken, async (req, res) => {
    req.body.id = req.user._id;
    let newpost = new Post()
    await newpost.createPost(req.body, req);
    res.redirect('/post');
})

//Implemented OOPs
app.post('/likepost/:id', authenticateToken, async (req, res) => {
    if (req.user != null) {
        new Post().likePost(req, res);
    } else {
        res.redirect('/login')
    }
})

app.post('/removelike/:id', authenticateToken, async (req, res) => {
    if (req.user) {
        let postid = req.params.id;
        let post = await posts.findOne({
            '_id': postid
        });
        if (post != null) {
            let index = post.likes.indexOf(req.user._id);
            if (index > -1) {
                post.likes.splice(index, 1);
            }
            await post.save();
        } else {
            res.send('Invalid Post ID');
        }
    } else {
        res.redirect('/');
    }
})

//OOPs Implemented
app.get('/comments/:id',authenticateToken, async (req, res) => {
    if(req.user!=null){
    let obj = await new Post().getComment(req);
    console.log(obj.post,obj.user)
    res.render(__dirname + '/public/views/comments/comments.ejs', {post: obj.post,user: obj.user});
    }
    else{
        res.redirect('/');
    }
})

//OOPs Implemented
app.post('/postcomment/:id', authenticateToken, async (req, res) => {
    if (req.user != null) {
        await new Post().postComment(req);
        res.redirect(`/comments/${req.params.id}`);
    } else {
        res.redirect(__dirname + '/public/views/login/login.ejs')
    }
})
1

app.get('/keepalive', (req, res) => {
    res.send('Ping Recieved ' + Date.now())
    console.log('Ping Recieved ' + Date.now());
})

app.listen('3000', () => console.log("Listening to Port 3000"));

setInterval(function () {
    http.get(process.env.hosturl + '/keepalive');
}, 30000)