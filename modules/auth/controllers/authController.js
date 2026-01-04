const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const logger = require('../../../utils/logger');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'validation_error', message: 'Email and password are required' });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'validation_error', message: 'Password must be at least 6 characters' });
  }
  try {
    const result = await authService.register({ name, email, password, role });
    logger.info(`User registered: ${email}`);
    res.status(201).json(result);
  } catch (err) {
    logger.error(`Error in register: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'validation_error', message: 'Email and password are required' });
  }
  try {
    const user = await authService.login({ email, password });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const jwt = require('jsonwebtoken');
    const { jwtSecret } = require('../../../config/env');
    const payload = { id: user.id || user._id, role: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    logger.info(`User logged in: ${email}`);
    res.json({ token });
  } catch (err) {
    logger.error(`Error in login: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
