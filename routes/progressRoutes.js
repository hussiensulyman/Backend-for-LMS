const express = require('express');
const { protect } = require('../middleware/auth');
const { getProgress } = require('../controllers/courseController');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Progress route is working' });
});

// Get progress for a course
router.get('/:courseId/progress', protect, getProgress);

module.exports = router;