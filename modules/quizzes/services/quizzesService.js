const Quiz = require('../models/Quiz');

module.exports = {
  async createQuiz(data) {
    const q = new Quiz(data);
    return q.save();
  },
};