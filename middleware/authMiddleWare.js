const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const authorizeUser = asyncHandler(async (req,res,next) => {
    let token;
    token = req.cookies.jwt || req.headers.authorization?.split('Bearer ')[1];  
    if(token) {
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password')
            next();
        } catch(err) {
            res.status(401);
            throw new Error('Not Authorized, Invalid token');
        }
    } else {
        res.status(401);
        throw new Error('Not Authorized, no token');
    }
})
module.exports = {authorizeUser}