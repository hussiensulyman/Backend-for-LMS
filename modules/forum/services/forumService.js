const ForumPost = require('../models/ForumPost');

module.exports = {
  async createPost(data) {
    const p = new ForumPost(data);
    return p.save();
  },
};