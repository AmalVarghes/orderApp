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
