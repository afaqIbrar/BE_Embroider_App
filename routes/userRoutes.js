const express = require('express');
const router = express.Router();
// const {validateCreateUser} = require('../validators/userValidators');
const {validateRequest} = require('../middleware/validateRequest');
const {createUserSchema,loginUserSchema,updateUserSchema,deleteUserSchema,updateUserProfileSchema} = require('../schemas/userSchema');
const {authUser,createUser,deleteUser,updateUser,getUsers,logoutUser,updateCurrentUser} = require('../controller/userController');
const {authorize} = require('../middleware/authMiddleWare');


router.route('/').get(authorize,getUsers).post(validateRequest(createUserSchema),createUser);
router.route('/profile').put(authorize,validateRequest(updateUserProfileSchema) ,updateCurrentUser)
router.route('/login').post(validateRequest(loginUserSchema),authUser)
router.route('/logout').post(authorize,logoutUser);
router.route('/:id').delete(authorize ,validateRequest(deleteUserSchema),deleteUser).put(authorize,validateRequest(updateUserSchema),updateUser);


module.exports = router;