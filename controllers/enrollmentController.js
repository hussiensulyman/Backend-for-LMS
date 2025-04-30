const Course = require('../models/Course');
const User = require('../models/User');

exports.enrollStudent = async (req, res) => {
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await User.findById(req.user.userId);
    if (!student || student.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll' });
    }

    if (course.students.includes(student._id)) {
      return res.status(400).json({ message: 'Student already enrolled' });
    }

    course.students.push(student._id);
    await course.save();

    res.status(200).json({ message: 'Student enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling student', error: error.message });
  }
};
