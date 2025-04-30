const Lesson = require('../models/Lesson');
const logger = require('../utils/logger');

exports.createLesson = async (req, res) => {
  const { title, description, course } = req.body;
  try {
    const lesson = new Lesson({ title, description, course });
    await lesson.save();

    logger.info(`Lesson created: ${lesson.title}`);
    res.status(201).json(lesson);
  } catch (err) {
    logger.error(`Error in createLesson: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};