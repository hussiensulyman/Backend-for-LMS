const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 }, // Progress as percentage
  lastUpdated: { type: Date, default: Date.now }
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
