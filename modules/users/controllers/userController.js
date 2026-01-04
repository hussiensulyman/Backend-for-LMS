const usersService = require('../services/usersService');

exports.getUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
