const user = require('../models/user.js');
const Database = require('./database.js');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const secretKey = process.env.cryptosecret || "your-crypto-secret-key"

//class User inherits class database which adds various functionalities to it 
class User extends Database {
    
    constructor(Data) {
        super();                //calls the constructor of the super class, if we don't do this it will result in a reference error
        let data = Data;        //create a copy of the original data, so that it cannot be modified/manipulated.
        this.getData = () => {  //declare a class method to privately access the data, to show Abstraction
            return data;        /* *USE OF ABSTRACTION* */
                                //return the copied data, so that other methods can access it and the original data remains safe
        }                        
    }


    async createUser() {
        
        let bool = await this.findExisting(this.getData().username);    //calls the findExisting function of Database class to check if username already exists
        console.log(bool)                                                            //*advantage of inheritance* 
                                                                    //the function is directly accessible to the User class because of inheritance
        if(bool===null){
        let flag = 1;
        let newUser = new user(this.getData());
        let cryptedPassword = CryptoJS.AES.encrypt(this.getData().password, secretKey)
        newUser.password = cryptedPassword;
        await newUser.generateAuthToken();
        await newUser.save((err, user) => {
            if (err) {
                console.log("An error occured while saving your data:\n" + err);
                flag = 0;
            } else {
                console.log("A new user has been registered. The Data is as follows:\n" + newUser);
            }
        });;
        if (flag === 1) {
            return newUser;
        } 
        else {
            return null;
        }
        }
        else{
            return null;
        }
    }

    async generateAuthToken() {
        await user.generateAuthToken();
    }

    async login(){

    }


}

module.exports = User;