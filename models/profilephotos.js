//import the MongoDB module 
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let jwt = require('jsonwebtoken');
//import dotenv module
require('dotenv').config();

//connect the cluster to the schema
mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });

/*Create a new model/object by the name of User
 *whenever a new user signs up this creates a new user object in the database*/
let Profilephotos = new Schema({
    profilephoto: String,
    id: String
})



//create a mongodb model with the name 'User' and Schema User
let profilephotos = mongoose.model('profilephotos', Profilephotos);

//export the model to use it in main files
module.exports = profilephotos;