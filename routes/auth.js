const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, login } = require('../controllers/authController');

// Example of a protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

// Example of another protected route
router.post('/update-profile', authMiddleware, (req, res) => {
  const user = req.user; // Access the user data from the token
  res.status(200).json({ message: 'Profile updated', user });
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;
