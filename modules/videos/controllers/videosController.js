const videosService = require('../services/videosService');
const logger = require('../../../utils/logger');

exports.createVideo = async (req, res) => {
  try {
    const v = await videosService.createVideo(req.body);
    res.status(201).json(v);
  } catch (err) {
    logger.error('Error creating video', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { timestamp, text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'validation_error', message: 'text is required' });
    }
    if (timestamp !== undefined && (!Number.isInteger(timestamp) || timestamp < 0)) {
      return res.status(400).json({ error: 'validation_error', message: 'timestamp must be a non-negative integer (ms)' });
    }
    // Persist author + optional timestamped annotation
    const comment = await videosService.addComment(videoId, req.user?.id, { timestamp, text });
    res.status(201).json(comment);
  } catch (err) {
    logger.error('Error adding comment', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.listComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await videosService.listComments(videoId);
    res.json(comments);
  } catch (err) {
    logger.error('Error listing comments', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};