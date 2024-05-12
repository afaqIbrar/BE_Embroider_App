const express = require('express');
const router = express.Router();
const {authorizeUser} = require('../middleware/authMiddleWare');
const {validateRequest} = require('../middleware/validateRequest');
const {createWorkSchema,deleteWorkSchema, updateWorkSchema,getByIdSchema} = require('../schemas/workSchema');
const {getAllWork,getWorkById,createWork,deleteWork,updateWork}  = require('../controller/workAssignmentController');


router.route('/').get(authorizeUser,getAllWork).post(authorizeUser,validateRequest(createWorkSchema),createWork);
router.route('/byId/:id').get(authorizeUser,validateRequest(getByIdSchema),getWorkById);
router.route('/:id').delete(authorizeUser,validateRequest(deleteWorkSchema),deleteWork).put(authorizeUser,validateRequest(updateWorkSchema),updateWork);



module.exports = router; 