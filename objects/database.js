const user = require('../models/user.js');
const Post = require('../models/posts.js');
const Profilephotos = require('../models/profilephotos.js');
const CryptoJS = require('crypto-js');
require('dotenv').config()
class Database {
    constructor() {
        if (this.constructor === Database) {
            throw new Error("Can't instantiate Abstract Class.");
        }
    }

    async showdb(classname, data = {}, all=false) {    
        if (classname.toLowerCase() === 'user') {
            classname = user;
        } 
        
        else if (classname.toLowerCase() === "post") {
            classname = Post;
        }
        
        else if(classname.toLowerCase()==="profilephotos"){
            classname = Profilephotos;
        }
        else {
                
        }
        if (JSON.stringify(data) === "{}") {
            return await classname.find({});
        } else {
            if (all==false) {
                return await classname.findOne(data);
            }
            else if(all==true) {
                return await classname.find(data);
            }
        }

    }


    async findExisting(username, password = null) {
        if (password === null) {
            let User = await user.findOne({
                'username': username
            });
            return User;
        } else {
            let User = await user.findOne({
                'username': username
            })
            if (User != null) {
                let temp = CryptoJS.AES.decrypt(User.password, process.env.cryptosecret);

                if (temp.toString(CryptoJS.enc.Utf8) === password) {
                    return User;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }

    async getModel(classname) {
    if(classname.toLowerCase()==='user'){    
        return user;
    }
    
    else if(classname.toLowerCase()==='post'){    
        return Post;
    }

    /*else if(classname.toLowerCase()==='photos'){    
        return photos;
    }*/
    

    }
}
module.exports = Database;