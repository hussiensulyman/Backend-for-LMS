const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true }
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
