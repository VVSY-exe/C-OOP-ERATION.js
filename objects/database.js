const mongoose = require("mongoose");
const user = require('../models/user.js');
const User = require("./user.js");
class Database {
    constructor() {
        console.log('A request was made at the Database.');
    }

    async showdb() {
        let db = await user.find({})
        return db;
    }

    async findExisting(username,password=null) {
        if (password===null){
        let User = await user.findOne({
            'username': username
        });
        return User;
    }
        else {
            let User = await user.findOne({'username': username, 'password': password})
            return User;
        }
    }
}
module.exports = Database;