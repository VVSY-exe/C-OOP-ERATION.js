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
let Register = new Schema({
    email: String,
    id: String,
    expire_at: {type: Date, default: Date.now, expires: 3600} 
})



//create a mongodb model with the name 'User' and Schema User
let register = mongoose.model('Register', Register);

//export the model to use it in main files
module.exports = register;