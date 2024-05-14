const express = require('express');
const router = express.Router();
const {authorizeUser} = require('../middleware/authMiddleWare');
const {validateRequest} = require('../middleware/validateRequest');
const {createWorkerSchema,updateWorkerSchema,deleteWorkerSchema,getByIdSchema} = require('../schemas/workerSchema');
const {getAllWorkers,createWorker,deleteWorker,updateWorker,getWorkerById}  = require('../controller/workerController');


router.route('/').get(authorizeUser,getAllWorkers).post(authorizeUser,validateRequest(createWorkerSchema),createWorker);
router.route('/byId/:id').get(authorizeUser,validateRequest(getByIdSchema),getWorkerById);
router.route('/:id').delete(authorizeUser,validateRequest(deleteWorkerSchema),deleteWorker).put(authorizeUser,validateRequest(updateWorkerSchema),updateWorker);



module.exports = router; 