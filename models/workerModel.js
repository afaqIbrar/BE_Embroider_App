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
    },
    balance: {
        type: Number,
        default: 0
    },
    initialBalanceType: {
        type: String,
        enum: ['to_receive', 'to_pay'],
        required: true
    }
}, { timestamps: true });

// Middleware to adjust balance when a new worker is created
workerSchema.pre('save', function(next) {
    if (this.isNew) {
        // If a balance is provided
        if (this.balance !== 0) {
            if (this.initialBalanceType === 'to_receive') {
                this.balance = -Math.abs(this.balance);  // set balance to negative if 'to_receive'
            } else if (this.initialBalanceType === 'to_pay') {
                this.balance = Math.abs(this.balance);   // set balance to positive if 'to_pay'
            }
        }
    }
    next();
});

module.exports = mongoose.model('workers', workerSchema);
