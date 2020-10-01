var User = require('./user.js');
var Pageimage = require('../models/pageimage.js');
class Page extends User {
    constructor(data) {
        super(data); //call the constructor of super class
    }

    async createPage(req) {
        let page = await this.createUser(req,true);
        if (page!=null) {
        page.about1 = req.body.about1;
        page.about2 = req.body.about2;
        page.about3 = req.body.about3;
        console.log(req.files)
        let pageimage = new Pageimage({
            image1: req.files.image1.data.toString("base64"),
            image2: req.files.image2.data.toString("base64"),
            image3: req.files.image3.data.toString("base64"),
            id: page._id
        });
        await page.save();
        await pageimage.save();
        return page;
    }
    else {
        return null;
    }
    }

    async getDashboard(req){
        let following = [];
        let database = new User()
        
        for (const ele of req.user.following) {
            let name = await database.showdb('User', {'_id': ele.friend});
            following.push(name.name);
        }
        let profilephoto = await this.showdb('profilephotos',{"id": req.user._id.toString()})
        profilephoto = profilephoto.profilephoto;
        let pageimage = await Pageimage.findOne({'id': req.user._id});
        return {
       user: req.user,
       profilephoto,
       following,
       pageimage     
    }
    }

}

module.exports = Page;
