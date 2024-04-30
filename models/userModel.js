const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    userName: {
        type:String,
        require: [true,"Please add a userName"],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    userType: {
        type: String,
        required: [true, 'Please add user type'],
        enum: ['ADMIN_USER', 'REGULAR_USER'],
    }
}, {timestamps : true});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

// userSchema.pre('findOneAndUpdate', async function (next) {
//     if (!this._update.password) {
//         return next();
//     }
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this._update.password = await bcrypt.hash(this._update.password, salt);
//         next();
//     } catch (error) {
//         return next(error);
//     }
// });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('users',userSchema);