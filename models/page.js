//import the MongoDB module 
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//import dotenv module
require('dotenv').config();

//connect the cluster to the schema
mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });

/*Create a new model/object by the name of User
 *whenever a new user signs up this creates a new user object in the database*/
let Page = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true
        , index:true, sparse:true},
    username: {type: String, required: true, index:true, sparse:true},
    bio: {type:String, required: true},
    about1: {type:String, required: true},
    about2: {type:String, required: true},
    about3: {type:String, required: true},
    following: [{
        _id: 0,
        friend: {type: String,}
    }],
    tokens: [{
    token: {type: String},
    _id: 0
    }]
})



//create a mongodb model with the name 'User' and Schema User
let page = mongoose.model('Page', Page);

//export the model to use it in main files
module.exports = page;