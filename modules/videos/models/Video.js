const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  providerUrl: String,
  duration: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Video || mongoose.model('Video', videoSchema);