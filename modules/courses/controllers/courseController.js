const courseService = require('../services/courseService');
const logger = require('../../../utils/logger');

exports.createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.user.id, req.body);
    logger.info(`Course created: ${course.title || course.id}`);
    res.status(201).json(course);
  } catch (err) {
    logger.error(`Error in createCourse: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    logger.error(`Error in updateCourse: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses();
    res.json(courses);
  } catch (err) {
    logger.error(`Error in getCourses: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const enrollment = await courseService.enrollStudent(req.body.code || req.body.courseId, req.user.id);
    res.json({ message: 'Enrollment successful', enrollment });
  } catch (err) {
    logger.error(`Error in enrollStudent: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const result = await courseService.getProgress(req.params.courseId);
    res.json(result);
  } catch (err) {
    logger.error(`Error in getProgress: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
