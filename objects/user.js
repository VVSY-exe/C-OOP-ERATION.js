const user = require('../models/user.js');

class User{
    
    constructor(data){
        this.data = data;
    }

    async createUser(){
        let newUser = new user(this.data);
        await newUser.save(); 
        console.log("A new user has been registered. The Data is as follows:\n"+newUser);
    }
}

module.exports = User;
