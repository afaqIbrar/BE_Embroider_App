const mongoose = require('mongoose');

const workerSchema = mongoose.Schema({
    workerName: {
        type: String,
        required: [true, "Please add a Worker Name"]
    },
    workerType: {
        type: String,
        required: [true, "Please add worker type"],
        enum: ['HAND_WORKER', 'DUPATTA_WORKER', 'INNER_WORKER'],
    },
    phoneNumber: {
        type: String,
    },
    extraInfo: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('workers', workerSchema);