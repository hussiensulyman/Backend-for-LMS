const { dbType } = require('../../../config/env');

if (dbType === 'mysql') {
  const { prisma } = require('../../../core/prisma');

  module.exports = {
    async create(data) {
      return prisma.video.create({ data });
    },
    async findById(id) {
      return prisma.video.findUnique({ where: { id: Number(id) }, include: { comments: true } });
    },
    async addComment(videoId, { userId, timestamp, text }) {
      return prisma.videoComment.create({ data: { videoId: Number(videoId), userId: Number(userId), timestamp, text } });
    },
    async listComments(videoId) {
      return prisma.videoComment.findMany({ where: { videoId: Number(videoId) }, orderBy: { createdAt: 'desc' } });
    },
  };
} else {
  const mongoose = require('mongoose');
  const Video = require('./Video');
  const VideoComment = require('./VideoComment');

  module.exports = {
    async create(data) {
      const v = new Video(data);
      return v.save();
    },
    async findById(id) {
      return Video.findById(id).populate('comments').lean();
    },
    async addComment(videoId, { userId, timestamp, text }) {
      const c = new VideoComment({ video: videoId, userId, timestamp, text });
      return c.save();
    },
    async listComments(videoId) {
      return VideoComment.find({ video: videoId }).sort({ createdAt: -1 }).lean();
    },
  };
}