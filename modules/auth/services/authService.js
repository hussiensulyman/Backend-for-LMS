const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../../../config/env');

module.exports = {
  async register({ name, email, password, role }) {
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('User already exists');
      err.status = 400;
      throw err;
    }

    const user = await User.create({ name, email, password, role });
    const payload = { id: user.id || user._id, role: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    return { token };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 400;
      throw err;
    }

    // bcrypt check should be performed by controller to avoid coupling with repo implementation
    return user;
  },
};
