const express = require('express');
const { protect, checkRole } = require('../../../middleware/auth');
const { createLesson } = require('../controllers/lessonController');

const router = express.Router();

router.post('/', protect, checkRole(['admin', 'instructor']), createLesson);

module.exports = router;
