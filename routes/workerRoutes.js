const express = require('express');
const router = express.Router();
const {authorizeUser} = require('../middleware/authMiddleWare');
const {validateRequest} = require('../middleware/validateRequest');
const {createWorkerSchema,updateWorkerSchema,deleteWorkerSchema} = require('../schemas/workerSchema');
const {getAllWorkers,createWorker,deleteWorker,updateWorker}  = require('../controller/workerController');


router.route('/').get(authorizeUser,getAllWorkers).post(authorizeUser,validateRequest(createWorkerSchema),createWorker);

router.route('/:id').delete(authorizeUser,validateRequest(deleteWorkerSchema),deleteWorker).put(authorizeUser,validateRequest(deleteWorkerSchema),updateWorker);



module.exports = router; 