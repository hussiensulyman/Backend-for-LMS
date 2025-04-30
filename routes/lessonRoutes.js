const express = require('express');
const { protect } = require('../middleware/auth');
const { createLesson } = require('../controllers/lessonController');

const router = express.Router();

// Create a lesson
router.post('/', protect, createLesson);

module.exports = router;