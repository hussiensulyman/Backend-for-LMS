const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  code: { type: String, required: true, unique: true },
  resources: [{ type: String }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Lessons in the course
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Lessons completed by the student
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);