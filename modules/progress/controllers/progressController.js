const Course = require('../../courses/models/Course');
const logger = require('../../../utils/logger');

exports.getProgress = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const totalLessons = course.lessons.length || 0;
    const completedLessons = course.completedLessons.length || 0;
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    res.json({ progress });
  } catch (err) {
    logger.error(`Error in getProgress: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};