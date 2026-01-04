const express = require('express');
const { protect, checkRole } = require('../../../middleware/auth');
const { createQuiz, submitQuiz } = require('../controllers/quizController');

const router = express.Router();

router.post('/:courseId/quizzes', protect, checkRole(['admin', 'instructor']), createQuiz);
router.post('/:id/submit', protect, checkRole(['student']), submitQuiz);

module.exports = router;
