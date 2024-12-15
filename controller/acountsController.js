const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const Worker = require('../models/workerModel');
//@desc Create user/
//route POST /api/users/
//@access Private
const createDebitTransaction = asyncHandler(async ({ workerId, workerAssignmentId, description, amount, previousBalance, currentBalance }) => {
    const exisitingTransaction = await Account.findOne({ workerId, workerAssignmentId, paymentType: 'DEBIT' });
    if (exisitingTransaction) {
        throw new Error('Transaction Already exist with this Data');
    }

    const transaction = await Account.create({
        workerId, workerAssignmentId, paymentType: 'DEBIT', description, amount, previousBalance, currentBalance, recordDate: new Date()
    })
    return {
        _id: transaction._id,
        amount: transaction?.amount,
        paymentType: transaction?.paymentType,
        previousBalance: transaction?.previousBalance,
        currentBalance: transaction?.currentBalance
    }
})


const createCreditTransaction = asyncHandler(async (req, res) => {
    const { workerId, description, amount, recordDate, paymentType } = req.body;
    if (amount === null || amount === '') {
        res.status(400);
        throw new Error('Amount Cannot be Null');
    }
    const worker = await Worker.findById(workerId);
    if (!worker) {
        throw new Error('No Worker found with this Data');
    }
    let newBalance = 0;
    if(paymentType === 'CREDIT') {
        newBalance = worker?.balance - Number(amount);
    }
    if(paymentType === 'DEBIT') {
        newBalance = worker?.balance + Number(amount);
    }
    const transaction = await Account.create({
        workerId, paymentType, description, amount, recordDate: recordDate || new Date(), previousBalance: worker?.balance, currentBalance: newBalance
    })
    worker.balance = newBalance;
    await worker.save();
    res.status(200).json({
        _id: transaction._id,
        amount: transaction?.amount,
        paymentType: transaction?.paymentType,
        previousBalance: transaction?.previousBalance,
        currentBalance: transaction?.currentBalance
    })
})

const updatetransaction = asyncHandler(async (req, res) => {
    const transaction = await Account.findById(req.params.id);
    if (!transaction) {
        res.status(400);
        throw new Error('Transaction not found')
    }

    transaction.amount = req.body.amount || transaction.amount; // Example field
    transaction.description = req.body.description || transaction.description; // Example field

    const updatedTransaction = await transaction.save();

    // Return the updated transaction in the response
    res.status(200).json({
        _id: updatedTransaction._id,
        amount: updatedTransaction.amount,
        description: updatedTransaction.description,
    });
})

const getTransactionByWorkerId = asyncHandler(async (req, res) => {
    if (!req.params.workerId) {
        res.status(400);
        throw new Error('Worker Id is Required')
    }
    let filter = { workerId: req.params.workerId };
    const { search, startDate, endDate } = req.query;
    // If search is present, add a condition to search in the description field
    if (search) {
        filter.description = { $regex: search, $options: 'i' };  // Case-insensitive search
    }
    // If startDate and endDate are provided, add the date range filter
    if (startDate && endDate) {
        filter.recordDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Find all transactions where workerId matches the req.params.id
    // Find all transactions where workerId matches the req.params.workerId and populate necessary fields
    const transactions = await Account.find(filter)
        .populate({
            path: 'workerId',            // Populate the workerId field
            select: '_id workerName balance'          // Optionally specify which fields you want to return from the worker document (like name, role)
        })
        .populate({
            path: 'workerAssignmentId',  // Populate the workerAssignmentId field
            populate: {
                path: 'processLotId',    // Within workerAssignmentId, populate processLotId
                select: '_id quantity billNumber articleNumber colour' // Optionally specify which fields you want from processLotId
            }
        })
        .sort({ recordDate: -1 });
    // If no transactions are found, return a 404 status with a message
    if (!transactions || transactions.length === 0) {
        return res.status(200).json([]);
    }

    // Return the found transactions in the response
    res.status(200).json(transactions);
});
module.exports = { createCreditTransaction, updatetransaction, getTransactionByWorkerId, createDebitTransaction }