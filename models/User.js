import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [80, 'Name should be under 80 characters.'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: [80, 'Username should be under 80 characters.'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password should be at least 6 characters.'],
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    location: String,
    age: Number,
    work: String,
    dob: Date,
    description: String,
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
