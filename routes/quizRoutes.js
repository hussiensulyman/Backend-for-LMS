const express = require('express');
const { protect } = require('../middleware/auth');
const { createQuiz, submitQuiz } = require('../controllers/quizController');

const router = express.Router();

router.post('/:courseId/quizzes', protect, createQuiz);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;