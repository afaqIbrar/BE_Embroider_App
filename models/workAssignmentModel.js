const mongoose = require('mongoose');

const workAssignment = mongoose.Schema({
    processLotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'processLot', // This should be the name of your processLot model
        required: [true, "Please add Process Lot"],
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workers', // This should be the name of your workers model
        required: [true, "Please add Worker Number"],
    },
    quantityLog: {
        type: String,
    },
    workType: {
        type: String,
        required: [true, "Please add Work type"],
        enum: ['HAND_WORK', 'DUPATTA_WORK', 'INNER_WORK'],
    },
    quantityReturned: {
        type: String,
    },
    rate: {
        type: String,
    },
    total: {
        type: String,
    },
    lotClearDate: {
        type: Date,
    },
    paymentGiven: {
        type: String
    },
    paymentMode: {
        type: String,
    },
    paymentDate: {
        type: Date,
    },
    reference: {
        type: String
    },
    claim: {
        type: String
    },
    gazana: {
        type: String
    }


}, { timestamps: true });

module.exports = mongoose.model('workAssignment', workAssignment);