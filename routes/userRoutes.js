const express = require('express');
const { protect, checkRole } = require('../middleware/authMiddleware');
const User = require('../models/User');
const logger = require('winston').loggers.get('default');
const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    logger.error('Error fetching users', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
