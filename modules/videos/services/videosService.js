const VideoRepo = require('../models/VideoRepo');

module.exports = {
  async createVideo(payload) {
    return VideoRepo.create(payload);
  },

  async addComment(videoId, userId, { timestamp, text }) {
    return VideoRepo.addComment(videoId, { userId, timestamp, text });
  },

  async listComments(videoId) {
    return VideoRepo.listComments(videoId);
  },
};