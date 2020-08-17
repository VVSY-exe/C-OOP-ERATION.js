const mongoose = require("mongoose");
const user = require('../models/user.js');
class Database {
    constructor() {
        console.log('A request was made at the Database.');
    }

    async showdb() {
        let db = await user.find({})
        return db;
    }

    async findExisting(username) {
        let user = await user.findOne({
            'username': username
        });
        if (user === null) {
            return true;
        } else {
            return false;
        }
    }
}
module.exports = Database;