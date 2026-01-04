const express = require('express');
const { protect, checkRole } = require('../../../middleware/auth');
const { createAssignment, submitAssignment, getAssignments, updateAssignment, deleteAssignment } = require('../controllers/assignmentController');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Assignment route works' });
});

router.post('/', protect, checkRole(['admin', 'instructor']), createAssignment);
router.post('/:id/submit', protect, checkRole(['student']), submitAssignment);
router.get('/', protect, getAssignments);
router.put('/:id', protect, checkRole(['admin', 'instructor']), updateAssignment);
router.delete('/:id', protect, checkRole(['admin', 'instructor']), deleteAssignment);

module.exports = router;
