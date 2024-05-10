const express = require('express');
const router = express.Router();
// const {validateCreateUser} = require('../validators/userValidators');
const {validateRequest} = require('../middleware/validateRequest');
const {createUserSchema,loginUserSchema,updateUserSchema,deleteUserSchema,updateUserProfileSchema} = require('../schemas/userSchema');
const {authUser,createUser,deleteUser,updateUser,getUsers,logoutUser,updateCurrentUser} = require('../controller/userController');
const {authorizeUser} = require('../middleware/authMiddleWare');


router.route('/').get(authorizeUser,getUsers).post(authorizeUser,validateRequest(createUserSchema),createUser);

router.route('/profile').put(authorizeUser,validateRequest(updateUserProfileSchema) ,updateCurrentUser);

router.route('/login').post(validateRequest(loginUserSchema),authUser);

router.route('/logout').post(logoutUser);

router.route('/:id').delete(authorizeUser ,validateRequest(deleteUserSchema),deleteUser).put(authorizeUser,validateRequest(updateUserSchema),updateUser);


module.exports = router;