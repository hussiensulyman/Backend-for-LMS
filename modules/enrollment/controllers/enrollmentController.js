const Course = require('../../courses/models/Course');
const Enrollment = require('../models/Enrollment');

exports.enrollStudent = async (req, res) => {
  const { courseCode } = req.body;

  try {
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      return res.status(404).json({ message: 'Invalid course code' });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: course._id,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: req.user.id,
      course: course._id,
    });

    await enrollment.save();

    course.students.push(req.user.id);
    await course.save();

    res.status(200).json({ message: 'Enrollment successful', course });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling student', error: error.message });
  }
};
