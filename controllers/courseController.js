const Course = require('../models/Course');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.createCourse = async (req, res) => {
  const { title, description, code } = req.body;
  try {
    const instructor = await User.findById(req.user.id);
    if (instructor.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can create courses' });
    }

    const course = new Course({ title, description, instructor: req.user.id, code });
    await course.save();

    logger.info(`Course created: ${course.title}`);
    res.status(201).json(course);
  } catch (err) {
    logger.error(`Error in createCourse: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  const { title, description, lessons, completedLessons } = req.body;
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.lessons = lessons || course.lessons;
    course.completedLessons = completedLessons || course.completedLessons;

    await course.save();

    logger.info(`Course updated: ${course.title}`);
    res.json(course);
  } catch (err) {
    logger.error(`Error in updateCourse: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name');
    res.json(courses);
  } catch (err) {
    logger.error(`Error in getCourses: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.enrollStudent = async (req, res) => {
  const { code } = req.body;
  try {
    const course = await Course.findOne({ code });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await User.findById(req.user.id);
    if (student.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    course.students.push(req.user.id);
    await course.save();

    logger.info(`Student enrolled: ${student.email} in ${course.title}`);
    res.json({ message: 'Enrollment successful', course });
  } catch (err) {
    logger.error(`Error in enrollStudent: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const totalLessons = course.lessons.length;
    const completedLessons = course.completedLessons.length;

    // Debugging logs
    console.log('Course:', course);
    console.log('Total Lessons:', totalLessons);
    console.log('Completed Lessons:', completedLessons);

    // Calculate progress
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    res.json({ progress });
  } catch (err) {
    logger.error(`Error in getProgress: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};