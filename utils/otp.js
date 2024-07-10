import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/User.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adityaanand1245@gmail.com',
        pass: 'xawk nogu bgff mqug',
    },
});

export const sendOtp = async (email) => {
    const otp = crypto.randomInt(100000, 999999);
    await User.updateOne({ email }, { otp });

    const mailOptions = {
        from: 'adityaanand1245@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

export const verifyOtp = async (email, otp) => {
    const user = await User.findOne({ email, otp });
    return !!user;
};
