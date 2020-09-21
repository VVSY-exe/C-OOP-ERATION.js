const Database = require("./database");
const posts = require('../models/posts.js');
//multiple inheritance
//User inherits Database, and post inherits user so post inherits database
class post extends Database {
    constructor() {
        super();
        console.log("Posts Class Accessed");
    }


    //Method 1

    async createPost(data,req){  
        console.log("New Post Created");           //data stores post and user details, req stores files(image)
        if (data.post != "") {              //if post is not empty
            let postdb = new posts()        //create a new entry in database
            postdb.id = data.id;            //stores the id of user who posted the post in that entry
            postdb.post = data.post;        //stores the post that the user posted in that entry
            if (req.files != null) {        //check if the user has uploaded an image
                postdb.photo = req.files.postphoto.data.toString("base64")
            }
            await postdb.save();
        } 
        
        else if (req.files != null) {
            let postdb = new posts()
            postdb.id = data.id;
            postdb.photo = req.files.postphoto.data.toString("base64")
            await postdb.save();
        }

    }

    //Method 2
    async likePost(req,res){
        let postid = req.params.id;
        let post = await this.showdb('Post',{'_id': postid});
        if (post != null) {
            post.likes.push({
                'by': req.user._id
            });
            await post.save();
            console.log("Liked Post Successfully");
            res.redirect('/post');
        } else {
            res.send("Illegal Post ID.");
        }
    
    }

    async postComment(req){
        let post = await this.showdb('post',{'_id': req.params.id})
        post.comments.push({
            'comment': req.body.comment,
            'by': req.user._id
        });
        await post.save()
    }

}

module.exports = post