const express = require('express');
const router = express.Router();
const {validateRequest} = require('../middleware/validateRequest');
const {authorizeUser} = require('../middleware/authMiddleWare');
const  {createCreditTransaction,updatetransaction,getTransactionByWorkerId}  = require('../controller/acountsController');
const {createTransactionSchema,updateTransactionSchema,getByIdSchema} = require('../schemas/accountsSchema');

router.route('/').post(authorizeUser,validateRequest(createTransactionSchema),createCreditTransaction)
router.route('/worker/:workerId').get(authorizeUser,validateRequest(getByIdSchema),getTransactionByWorkerId);
router.route('/:id').put(authorizeUser,validateRequest(updateTransactionSchema),updatetransaction);

module.exports = router;