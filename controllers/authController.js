const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/env');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password, role });
    await user.save();

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    logger.info(`User registered: ${user.email}`);
    res.status(201).json({ token });
  } catch (err) {
    logger.error(`Error in register: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    logger.info(`User logged in: ${user.email}`);
    res.json({ token });
  } catch (err) {
    logger.error(`Error in login: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};