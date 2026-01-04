const Progress = require('../models/Progress');

module.exports = {
  async getProgress(studentId, courseId) {
    return Progress.findOne({ studentId, courseId });
  },
};