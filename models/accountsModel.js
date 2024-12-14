const mongoose = require('mongoose');
const accountsSchema = mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workers', // This should be the name of your workers model
        required: [true, "Please add Worker Number"],
    },
    workerAssignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workAssignment', // This should be the name of your Work Assignment model
    },
    paymentType: {
        type: String,
        required: [true, 'Please add Payment type'],
        enum: ['DEBIT', 'CREDIT'],
    },
    description: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0
    },
    previousBalance: {
        type: Number,
        default: 0
    },
    currentBalance: {
        type: Number,
        default: 0
    },
    recordDate: {
        type: Date,
    },
    
}, {timestamps : true});
module.exports = mongoose.model('accounts',accountsSchema);