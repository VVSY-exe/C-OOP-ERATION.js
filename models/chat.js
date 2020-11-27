//import the MongoDB module 
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//import dotenv module
require('dotenv').config();

//connect the cluster to the schema
mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });

/*Create a new model/object by the name of User
 *whenever a new user signs up this creates a new user object in the database*/
let Chat = new Schema({
    chatid: {type: String, required: true},
    messages : [new Schema({
        message: String,
        timestamp: String,
        by: String
    }, {_id: false})]
})



//create a mongodb model with the name 'User' and Schema User
let page = mongoose.model('Chat', Chat);

//export the model to use it in main files
module.exports = page;