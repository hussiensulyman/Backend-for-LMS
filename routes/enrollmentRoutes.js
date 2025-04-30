const express = require('express');
const Course = require('../models/Course'); // Ensure the correct path for the Course model
const Enrollment = require('../models/Enrollment'); // Import the Enrollment model
const { protect, checkRole } = require('../middleware/auth'); // Middleware for authentication and role-based access
const router = express.Router();

// POST: Enroll a student in a course
router.post('/enroll', protect, checkRole(['Student']), async (req, res) => {
  const { courseCode } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      return res.status(404).json({ message: 'Invalid course code' });
    }

    // Check if the student is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: course._id,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Enroll the student by creating an Enrollment record
    const enrollment = new Enrollment({
      student: req.user.id,
      course: course._id,
    });

    await enrollment.save();

    // Add the student to the course's enrolledStudents array
    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.status(200).json({
      message: 'Enrollment successful',
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
});

router.get('/enroll', (req, res) => {
    res.status(200).json({ message: 'GET request to /api/enroll is working' });
  });

module.exports = router;
