const express = require('express');
const { protect } = require('../../../middleware/auth');
const { createVideo, addComment, listComments } = require('../controllers/videosController');

const router = express.Router();

router.post('/', protect, createVideo);
router.post('/:videoId/comments', protect, addComment);
router.get('/:videoId/comments', listComments);

module.exports = router;