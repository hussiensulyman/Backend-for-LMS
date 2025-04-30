const Quiz = require('../models/Quiz');
const logger = require('../utils/logger');

exports.createQuiz = async (req, res) => {
  const { questions, duration } = req.body;
  try {
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
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const score = answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length;

    logger.info(`Quiz submitted by user: ${req.user.id}`);
    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    logger.error(`Error in submitQuiz: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};