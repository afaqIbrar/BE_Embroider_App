const mongoose = require('mongoose');

const processLot = mongoose.Schema({
    pageNumber: {
        type: String,
        required: [true, "Please add a Page Number"]
    },
    articleNumber: {
        type: String,
        required: [true, "Please add Article Number"],

    },
    colour: {
        type: String,
        required: [true, "Please add Color"],
    },
    billNumber: {
        type: String,
    },
    quantity: {
        type: String,
    },
    handWorkerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workers', // This should be the name of your worker model
        default: null
    },
    dupattaWorkerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workers',
        default: null
    },
    innerWorkerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workers',
        default: null
    },
    assignDate: {
        type: Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('processLot', processLot);