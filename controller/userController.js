const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../services/authService');
//@desc Create user/
//route POST /api/users/
//@access Private
const createUser = asyncHandler(async (req, res) => {
    const { userName, password, userType } = req.body
    const userExist = await User.findOne({ userName });
    if (userExist) {
        res.status(400);
        throw new Error('User Already exist with this user name');
    }

    const user = await User.create({
        userName, password, userType
    })

    if (user) {
        const token = generateToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            userType: user.userType,
            token
        })
    } else {
        res.status(400);
        throw new Error('Invalid User Data');
    }
})

//@desc Update user//set token
//route PUT /api/users/:id
//@access Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found')
    }
    user.userName = req.body.userName || user.userName;
    user.userType = req.body.userType || user.userType;

    if (req.body.password) {
        user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        userName: updatedUser.userName,
        userType: updatedUser.userType
    });
})

//@desc delete user/
//route DELETE /api/users/:id
//@access Public
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found')
    }
    await user.deleteOne();

    res.status(200).json({ id: req.params.id })
})

const updateCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found')
    }
    user.userName = req.body.userName || user.userName;
    user.userType = req.body.userType || user.userType;

    if (req.body.password) {
        user.password = req.body.password;
    }

    // const updatedUser = await User.findByIdAndUpdate(req.user.id,req.body,{new:true}).select('-password')
    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        userName: updatedUser.userName,
        userType: updatedUser.userType
    });
});

//@desc GET user/
//route GET /api/users/
//@access Private
const getUsers = asyncHandler(async (req, res) => {
    let query = {};
    if (req.query.search) {
        query.userName = { $regex: req.query.search, $options: 'i' };
    }

    // Fetch users based on the query
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    // const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
})

//@desc Auth user//set token
//route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body
    const user = await User.findOne({ userName });
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            userType: user.userType,
            token
        })
    } else {
        res.status(400);
        throw new Error('Invalid Email or password');
    }
})

//@desc Logout user//set token
//route POST /api/users/logout
//@access Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User Logged out' });
})

module.exports = { authUser, createUser, updateUser, deleteUser, getUsers, logoutUser, updateCurrentUser }