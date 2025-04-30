const express = require('express');
const { protect } = require('../middleware/auth');
const { createCourse, updateCourse, getCourses, enrollStudent } = require('../controllers/courseController');

const router = express.Router();

router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.get('/', getCourses);
router.post('/enroll', protect, enrollStudent);

module.exports = router;