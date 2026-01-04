const User = require('../../auth/models/User');

module.exports = {
  async getAllUsers() {
    return User.findMany();
  },
};
