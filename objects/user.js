const user = require('../models/user.js');
const Database = require('./database.js');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const Post = require('./post.js');
const Profilephotos = require('./profilephotos.js');
const Register = require('../models/register.js');
const Random = require('./random.js')
const secretKey = process.env.cryptosecret || "your-crypto-secret-key"
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});


//class User inherits class database which adds various functionalities to it 
class User extends Database {

    constructor(Data) {
        super(); //calls the constructor of the super class, if we don't do this it will result in a reference error
        let data = Data; //create a copy of the original data, so that it cannot be modified/manipulated.
        this.getData = () => { //declare a class method to privately access the data, to show Abstraction
            return data; /* *USE OF ABSTRACTION* */
            //return the copied data, so that other methods can access it and the original data remains safe
        }
    }

    async generateRegisterLink(email) {
        let link = new Register();
        link.email = email;
        link.id = new Random().randomString(16);
        await link.save();
        return link;
    }

    async sendRegisterMail(email,res){
        let tempregister= await this.generateRegisterLink(email);
        let link = process.env.hosturl+'/signup/'+tempregister.id;
            let mailOptions = {
                from: process.env.email,
                to:email,
                subject:'Registration Link for C-OOP-ERATION',
                html:`<h1>Hello! Thanks for registering on C-OOP-ERATION!</h1><br>
                        <h3>To verify your email and continue registration please click on the link below:</h2><br>
                        <a href="${link}">Click here to get started!</a><br>
                        <p><i>If this was not you, please ignore this mail.</i></p><br>` 
            
                }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  res.send("An error occured while sending email, please make sure your email is correct, or try again later.");
                } else {
                  console.log('Email sent: ' + info.response);
                  res.send("Please check your email for the verification link.")
                }
              });
              
    
}

    async createUser(req,page=false) {

        let bool = await this.findExisting(this.getData().username,null,this.getData().email); //calls the findExisting function of Database class to check if username already exists
        //*advantage of inheritance* 
        //the function is directly accessible to the User class because of inheritance
        if (bool === null){
            let flag = 1;
            let newUser = new user(this.getData());
            let cryptedPassword = CryptoJS.AES.encrypt(this.getData().password, secretKey)
            newUser.password = cryptedPassword;
            if (req.files!=null){
            await new Profilephotos().assignProfilePhoto(req, newUser);
            if (page==false) { //to prevent Parallel Save Error in MongoDB
            try {
                await newUser.save();
                console.log("A new user has been registered. The Data is as follows:\n" + newUser);
                }
        
        catch(err) {
            console.log("An error occured while saving your data:\n" + err);
            flag = 0;
        }

        }
        else {
            newUser.isPage = true;
        }
            if (flag === 1) {
                return newUser;
            } else {
                return null;
            }
        }
        else {
            return(null)
        }
     } else {
            return null;
        }

    }

    async loginCheck(username, password) {
        //checks if user exists, if yes, returns the user
        let user = await this.findExisting(username, password);
        return user;
    }

    async generateToken(User, res) {
        if (User != null) {
            //if user is correct, sign a new jwt token and store it in the user's data
            let userid = User._id;
            const accessToken = jwt.sign(User.toJSON(), process.env.JWT_KEY);
            res.cookie('Authorization', accessToken, {
                maxAge: 1000000000000,
                httpOnly: false
            });

            let userdata = await user.findById(userid);
            await userdata.tokens.push(accessToken);
            await userdata.save();
            res.redirect('/')
        } else {
            res.send('Wrong credentials');
        }
    }

    async logout(user, req, res, all = false) {
        //if all is false, remove only the current session from the database
        if (all === false) {
            let token = req.cookies.Authorization;
            res.clearCookie("Authorization");
            user.tokens = user.tokens.filter(ele => {
                return ele._id != token;
            })
            await user.save();
            //if all is true, remove all the sessions
        } else if (all === true) {
            user.tokens = [];
            console.log('Cleared all tokens');
            await user.save();
            let token = req.cookies.Authorization;
            res.clearCookie("Authorization");
        } else {
            res.send('Invalid Argument');
        }
    }


    async getTimeline(user) {
        //get the whole post database
        let postdb = await new Post().showdb('post');
        //create variables to store data
        let post = [],
            by = [],
            profilepic = [];
        let flag = 0;
        //loop through the database to filter the timeline
        for (let i = 0; i < postdb.length; i++) {
            for (let j = 0; j < user.following.length; j++) {
                if (user.following[j].friend === postdb[i].id || user._id == postdb[i].id) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 1) {
                if (postdb[i].tag=="General") {
                    profilepic.push(await new Profilephotos().showdb('profilephotos',{'id': (postdb[i].id)}))
                    post.push(postdb[i]);
                    by.push(await new User().showdb('User', {'_id': postdb[i].id}))
                    flag = 0;
                }
            }

        }
        //return the data
        return {post,by,profilepic};
    }


    async getDashboard(req){
        //get the posts of the user
        let following = [];
        let database = new User()
        let post = await this.showdb('post',{'id': req.user._id},true);  //polymorphism
        for (const ele of req.user.following) {
            let name = await database.showdb('User', {'_id': ele.friend});
            following.push(name.name);

        }
        let profilephoto = await this.showdb('profilephotos',{"id": req.user._id.toString()})
        profilephoto = profilephoto.profilephoto;
        //return the data
    return {
       post,
       user: req.user,
       profilephoto,
       following     
    }
    }
    
    async getFollowingList(req){
        //get the user 
        let user = req.user;
        let users = await new User().showdb('User');
        let profilepic = []
        //filter user's name from the list
        users = users.filter(function (obj) {
            return obj.name !== user.name;
        });
        let following = []
        //check if user already follows
        for (let user of users) {
            let flag = 0;
            for (let follows of req.user.following) {
                if (follows.friend == user._id) {
                    following.push(true);
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                following.push(false);
            }
            
        }
        //get profilephotos
        for (let user of users) {
            profilepic.push(await new Profilephotos().showdb('Profilephotos',{
                'id': user._id
            }))
        }
        //return all the data
        return {
            users,
            user: req.user,
            profilepic,
            following
        }
    }

    async followUser(req,res){
        //get the user to be folloed
        let user = req.user;
        let followuser = await new User().showdb('User', {
            '_id': req.params.id
        });
        //check if user exists
        if (followuser != null) {
            //if existing, add user to their followers
            followuser.followers.push({
                'friend': user._id
            });
            await followuser.save();
            //add the followed user to the user's following list
            user.following.push({
                'friend': followuser._id
            });
            await user.save();
        } else {
            res.send("User does not exist.")
        }
    }

    async getComplaints(user={},help=false) {
        ////create variables to store data
        let post = [],
            by = [],
            profilepic = [];
            let postdb;
        if(user==={}){
            //get posts of all users
             postdb = await new Post().showdb('post');
        }
        else {
            //get all posts of a specific user
             postdb= await new Post().showdb('post',{'id':user._id},true);
        }

        //loop through the data and filter it
        for (let i = 0; i < postdb.length; i++) {
            let tag;
                if (help==false) {
                    tag="Complaint";
                }
                else {
                    tag="Help";
                }
                if (postdb[i].tag==tag) {
                    profilepic.push(await new Profilephotos().showdb('profilephotos',{'id': (postdb[i].id)}))
                    post.push(postdb[i]);
                    by.push(await new User().showdb('User', {'_id': postdb[i].id}))
                }
        }
        //return all the filtered data
        return {post,by,profilepic};
    }
    async getAnnouncements(user={}) {
        //create variables to store data
        let post = [],
            by = [],
            profilepic = [];
            let postdb;
            //get all the posts
            postdb = await new Post().showdb('post');
        
        for (let i = 0; i < postdb.length; i++) {
            //filter all the posts with Announcement tag
            let tag = "Announcement";
                if (postdb[i].tag==tag) {
                    profilepic.push(await new Profilephotos().showdb('profilephotos',{'id': (postdb[i].id)}))
                    post.push(postdb[i]);
                    by.push(await new User().showdb('User', {'_id': postdb[i].id}))
                }
        }
        //return the filtered data
        return {post,by,profilepic};
    }
}


module.exports = User;