//import the MongoDB module 
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//import dotenv module
require('dotenv').config();

//connect the cluster to the schema
mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });

/*Create a new model/object by the name of User
 *whenever a new user signs up this creates a new user object in the database*/
let User = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true}
})

//create a mongodb model with the name 'User' and Schema User
let user = mongoose.model('User', User);

//export the model to use in main files
module.exports = user;