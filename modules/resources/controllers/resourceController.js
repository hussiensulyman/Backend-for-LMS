const Course = require('../../courses/models/Course');
const logger = require('../../../utils/logger');

exports.uploadResource = async (req, res) => {
  const { file } = req.body;
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.resources.push(file);
    await course.save();

    logger.info(`Resource uploaded for course: ${course.title}`);
    res.json({ message: 'Resource uploaded successfully', course });
  } catch (err) {
    logger.error(`Error in uploadResource: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};