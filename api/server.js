import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import User from './models/User.js';
import { sendOtp, verifyOtp } from './utils/otp.js';

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/user-registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.post('/register', async (req, res) => {
    const { email, userName, password } = req.body;

    if (!email || !userName || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { userName }] });
    if (userExists) {
        return res.status(400).json({ error: 'Email or Username already exists' });
    }

    const newUser = new User({ email, userName, password });
    await newUser.save();
    await sendOtp(email);

    res.status(201).json({ message: 'User registered successfully. Please check your email for OTP.' });
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    const isValid = await verifyOtp(email, otp);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    await User.updateOne({ email }, { isVerified: true });

    res.status(200).json({ message: 'OTP verified successfully' });
});

app.post('/complete-profile', async (req, res) => {
    const { email, location, age, work, dob, description } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    user.location = location;
    user.age = age;
    user.work = work;
    user.dob = dob;
    user.description = description;
    await user.save();

    res.status(200).json({ message: 'Profile completed successfully' });
});

app.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { userName: emailOrUsername }]
    }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });

    res.status(200).json({ token });
});

app.get('/dashboard', async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = jwt.verify(token, 'secretKey');
    const user = await User.findById(decoded.id);

    res.status(200).json(user);
});

app.put('/update-profile', async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = jwt.verify(token, 'secretKey');
    const user = await User.findById(decoded.id);

    const { location, age, work, dob, description } = req.body;
    user.location = location;
    user.age = age;
    user.work = work;
    user.dob = dob;
    user.description = description;
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
