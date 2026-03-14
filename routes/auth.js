const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

// Example of a protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

router.get('/profile', getProfile);
router.post('/profile', updateProfile);
router.put('/profile', updateProfile);

router.post('/register', register);
router.post('/login', login);

module.exports = router;
