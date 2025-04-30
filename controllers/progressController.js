const Course = require('../models/Course');
const logger = require('../utils/logger');

exports.getProgress = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const progress = (course.completedLessons / course.totalLessons) * 100;
    res.json({ progress });
  } catch (err) {
    logger.error(`Error in getProgress: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};