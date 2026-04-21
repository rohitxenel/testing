const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const { sendOTP } = require('../utils/mail');
const router = express.Router();

// Register User - Send OTP
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {};

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = parseInt(otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false }), 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('Creating user...');
    const newUser = new User({ username, email, password, otp, otpExpires });
    console.log('Saving user...');
    await newUser.save();
    console.log('User saved successfully');

    try {
      await sendOTP(email, otp);
    } catch (sendError) {
      console.error('OTP send error:', sendError.message);
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }

    res.status(200).json({ message: 'OTP sent to your email. Please verify to complete registration.' });
  } catch (err) {
    console.log('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'User verified successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
