const Database = require("./database.js");
const posts = require('../models/posts.js');
const User = require('./user.js');
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
            postdb.tag = data.tag;          //stores the tag of the post the user has created
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
        let flag=1;
        if (post != null) {
            if(post.likes.length===0) {
                post.likes.push({
                    'by': req.user._id
                }); 
            flag=0;
            }
        else{
        for(let ele of post.likes){
            if(ele.by==req.user._id){
                flag=0
                break;
            }
        }
        }
            if(flag==1){
                post.likes.push({
                    'by': req.user._id
                });
            }
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

    async getComment(req){
        let post = await this.showdb('post',{'_id': req.params.id});
        let by = [],user = [];
        post.comments.forEach(ele => {
            by.push(ele.by);
        })
        for (const ele of by) {
            user.push(await this.showdb('user', {'_id': ele}));
        }
    return {post,user}
    }

}

module.exports = post