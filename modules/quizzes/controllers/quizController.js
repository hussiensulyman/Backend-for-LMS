const Quiz = require('../models/Quiz');
const logger = require('../../../utils/logger');

exports.createQuiz = async (req, res) => {
  const { questions, duration } = req.body;
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'validation_error', message: 'questions array is required' });
  }
  try {
    // Tie quiz to course and store raw question objects (schema validation in model)
    const quiz = new Quiz({ course: req.params.courseId, questions, duration });
    await quiz.save();

    logger.info(`Quiz created for course: ${req.params.courseId}`);
    res.status(201).json(quiz);
  } catch (err) {
    logger.error(`Error in createQuiz: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitQuiz = async (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'validation_error', message: 'answers array is required' });
  }
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'not_found', message: 'Quiz not found' });
    }

    // Straight equality check against stored correctAnswer; assumes arrays align by index
    const score = answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length;

    logger.info(`Quiz submitted by user: ${req.user.id}`);
    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    logger.error(`Error in submitQuiz: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};