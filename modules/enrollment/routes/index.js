const express = require('express');
const { protect, checkRole } = require('../../../middleware/auth');
const { enrollStudent } = require('../controllers/enrollmentController');

const router = express.Router();

// POST: Enroll a student in a course
router.post('/enroll', protect, checkRole(['Student']), enrollStudent);

router.get('/enroll', (req, res) => {
  res.status(200).json({ message: 'GET request to /api/enroll is working' });
});

module.exports = router;
