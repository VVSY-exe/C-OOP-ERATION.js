const User = require('../objects/user.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
async function authenticateToken(req,res,next){
    const token = req.cookies.Authorization;
    
    if(!token){ req.user = null;
    next();
    return req.user;
    }
    
    try{
        const verified = jwt.verify(token,process.env.JWT_KEY)
        console.log(verified);
        req.user = await new User().showdb({'_id': verified});
        next();    
    }catch(err){
        res.send('An error occured while verifying token:\n'+err);
        next();
    }
    
}

module.exports = authenticateToken;