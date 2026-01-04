const Assignment = require('../models/Assignment');
const logger = require('../../../utils/logger');

exports.createAssignment = async (req, res) => {
  const { course, title, description, deadline } = req.body;
  if (!course || !title) {
    return res.status(400).json({ error: 'validation_error', message: 'course and title are required' });
  }
  try {
    // Minimal shape validation; business rules live in model schema
    const assignment = new Assignment({ course, title, description, deadline });
    await assignment.save();

    logger.info(`Assignment created: ${assignment.title}`);
    res.status(201).json(assignment);
  } catch (err) {
    logger.error(`Error in createAssignment: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitAssignment = async (req, res) => {
  const { file } = req.body;
  if (!file) {
    return res.status(400).json({ error: 'validation_error', message: 'file is required' });
  }
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'not_found', message: 'Assignment not found' });
    }

    const submission = {
      student: req.user.id,
      file,
    };

    // Store submission inline; consider moving to separate collection if it grows
    assignment.submissions.push(submission);
    await assignment.save();

    logger.info(`Assignment submitted by user: ${req.user.id}`);
    res.json({ message: 'Assignment submitted successfully', assignment });
  } catch (err) {
    logger.error(`Error in submitAssignment: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignments = async (req, res) => {
  const { course } = req.query;
  try {
    const assignments = await Assignment.find({ course }).populate('course', 'title');
    res.json(assignments);
  } catch (err) {
    logger.error(`Error in getAssignments: ${err.message}`);
    res.status(500).json({ error: 'server_error', message: 'Server error' });
  }
};

exports.updateAssignment = async (req, res) => {
  const { title, description, deadline } = req.body;
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'not_found', message: 'Assignment not found' });
    }

    // Update fields
    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.deadline = deadline || assignment.deadline;

    await assignment.save();

    logger.info(`Assignment updated: ${assignment.title}`);
    res.json(assignment);
  } catch (err) {
    logger.error(`Error in updateAssignment: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.deleteOne(); // Use deleteOne() instead of remove()

    logger.info(`Assignment deleted: ${assignment.title}`);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    logger.error(`Error in deleteAssignment: ${err.message}`);
    res.status(500).json({ error: 'server_error', message: 'Server error' });
  }
};
