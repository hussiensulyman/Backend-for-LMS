const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
  }],
  duration: { type: Number, required: true }, // Duration in minutes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', quizSchema);