const ForumPost = require('../models/ForumPost');
const logger = require('../utils/logger');

exports.createPost = async (req, res) => {
  const { content } = req.body;
  try {
    const post = new ForumPost({ course: req.params.courseId, user: req.user.id, content });
    await post.save();

    logger.info(`Forum post created by user: ${req.user.id}`);
    res.status(201).json(post);
  } catch (err) {
    logger.error(`Error in createPost: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({ course: req.params.courseId }).populate('user', 'name');
    res.json(posts);
  } catch (err) {
    logger.error(`Error in getPosts: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};