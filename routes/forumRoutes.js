const express = require('express');
const { protect } = require('../middleware/auth');
const { createPost, getPosts } = require('../controllers/forumController');

const router = express.Router();

router.post('/:courseId/posts', protect, createPost);
router.get('/:courseId/posts', getPosts);

module.exports = router;