const mongoose = require("mongoose");
const user = require('../models/user.js');
const User = require("./user.js");
const CryptoJS = require('crypto-js');
require('dotenv').config()
class Database {
    constructor() {
        console.log('A request was made at the Database.');
    }

    async showdb(data={}) {
        if (JSON.stringify(data)==="{}"){
            return await user.find({});
        }
        else {
            return await user.findOne(data);
        }
    }

    async findExisting(username,password=null) {
        if (password===null){
        let User = await user.findOne({
            'username': username
        });
        return User;
    }
        else {
            let User = await user.findOne({'username': username})
           if(User!=null){ 
            let temp = CryptoJS.AES.decrypt(User.password,process.env.cryptosecret);
            
            if(temp.toString(CryptoJS.enc.Utf8)===password){
            return User;
            }
            

            else{
                return null;
            }
        }
        else{
            return null;
        }
        }
    }

    async getModel(){
        return user;
    }
}
module.exports = Database;