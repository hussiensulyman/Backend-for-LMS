const Assignment = require('../models/Assignment');

module.exports = {
  async createAssignment(data) {
    const a = new Assignment(data);
    return a.save();
  },
};
