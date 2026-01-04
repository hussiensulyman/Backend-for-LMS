const Lesson = require('../models/Lesson');

module.exports = {
  async createLesson(data) {
    const l = new Lesson(data);
    return l.save();
  },
};