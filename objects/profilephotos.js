let Database = require('./database.js');
let Profilephotos = require('../models/profilephotos.js')
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class profilephoto extends Database{
    constructor(){
        super();
    }

    async assignProfilePhoto(req,status){
        //creates a new pfp document and assigns the user's id to it
        let response = await cloudinary.uploader.upload("data:image/png;base64," + req.files.profilephoto.data.toString("base64"));
        let pfp = new Profilephotos({
            id: await status._id,
            profilephoto: response.secure_url
        });
        await pfp.save();
    }
}

module.exports = profilephoto;