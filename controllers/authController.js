const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// Login User
exports.login = async (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    try {
        // Find user in the database by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // User not found
        }

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Password doesn't match
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Set token expiration to 1 hour
        });

        // Return the generated token to the user
        res.status(200).json({ token });
    } catch (err) {
        console.error("Error during login:", err); // Log the actual error
        res.status(500).json({ message: 'Server error', error: err.message }); // Return error response
    }
};

// Register User
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    const username = req.query.username || req.body.username || req.user?.username;

    if (!username) {
        return res.status(400).json({ message: 'Username required' });
    }

    try {
        const user = await User.findOne({ username }).select('username fullName mobile');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    const { username, fullName, mobile } = req.body;
    const resolvedUsername = req.user?.username || username;

    if (!resolvedUsername) {
        return res.status(400).json({ message: 'Username required' });
    }

    const update = {};
    if (fullName !== undefined) update.fullName = fullName;
    if (mobile !== undefined) update.mobile = mobile;

    try {
        const user = await User.findOneAndUpdate(
            { username: resolvedUsername },
            { $set: update },
            { new: true, select: 'username fullName mobile' }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated', user });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
