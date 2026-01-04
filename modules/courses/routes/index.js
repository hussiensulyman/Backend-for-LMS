const express = require('express');
const { protect, checkRole } = require('../../../middleware/auth');
const { createCourse, updateCourse, getCourses, enrollStudent } = require('../controllers/courseController');

const router = express.Router();

router.post('/', protect, checkRole(['admin', 'instructor']), createCourse);
router.put('/:id', protect, updateCourse);
router.get('/', getCourses);
// Enrollment restricted to students only
router.post('/enroll', protect, checkRole(['student']), enrollStudent);

module.exports = router;
