const user = require("../models/user");
const Database = require("./database");

const User = require('./user.js');
const posts = require('../models/posts.js');
//multiple inheritance
//User inherits Database, and post inherits user so post inherits database
class post extends User{
    constructor(data,req){
        super();
    (async () => {
    if(data.post!=""){
        let postdb = new posts()
    postdb.id = data.id;
    postdb.post = data.post;
    if(req.files!=null){
    postdb.photo= req.files.postphoto.data.toString("base64")
    }
    await postdb.save();
    }
    else if(req.files!=null) {
        let postdb = new posts()
        postdb.id = data.id;
        postdb.photo= req.files.postphoto.data.toString("base64")
        await postdb.save();
    } 
    
    })();
}
}

module.exports = post