const express = require('express');
const router = express.Router();
const {authorizeUser} = require('../middleware/authMiddleWare');
const {validateRequest} = require('../middleware/validateRequest');
const {createProcessLotSchema,updateProcessLotSchema,deleteProcessLotSchema} = require('../schemas/processLotSchema');
const {getAllProcessLot,createProcessLot,deleteProcessLot,updateProcessLot}  = require('../controller/processLotController');


router.route('/').get(authorizeUser, getAllProcessLot).post(authorizeUser,validateRequest(createProcessLotSchema),createProcessLot);

router.route('/:id').delete(authorizeUser,validateRequest(deleteProcessLotSchema),deleteProcessLot).put(authorizeUser,validateRequest(updateProcessLotSchema),updateProcessLot);



module.exports = router; 