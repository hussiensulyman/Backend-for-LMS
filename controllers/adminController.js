const User = require('../models/User');
const Course = require('../models/Course');
const logger = require('../utils/logger');

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalStudents = await User.countDocuments({ role: 'student' });

    res.json({ totalUsers, totalCourses, totalInstructors, totalStudents });
  } catch (err) {
    logger.error(`Error in getAnalytics: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};