const user = require('../models/user.js');
const Database = require('./database.js');
const CryptoJS = require('crypto-js')

const secretKey = process.env.cryptosecret || "your-crypto-secret-key"

class User {

    constructor(data) {
        this.data = data;
    }

    async createUser() {

        let flag = 1;
        let newUser = new user(this.data);
        let cryptedPassword = CryptoJS.AES.encrypt(this.data.password, secretKey)
        newUser.password = cryptedPassword;
        await newUser.save((err, user) => {
            if (err) {
                console.log("An error occured while saving your data:\n" + err);
                flag = 0;
            } else {
                console.log("A new user has been registered. The Data is as follows:\n" + newUser);
            }
        });;
        if (flag === 1) {
            return true;
        } else {
            return false;
        }
    }

}

module.exports = User;