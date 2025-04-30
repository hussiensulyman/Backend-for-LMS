const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createAssignment,
  submitAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} = require('../controllers/assignmentController');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Assignments route is working' });
});

// Create an assignment
router.post('/', protect, createAssignment);

// Submit an assignment
router.post('/:id/submit', protect, submitAssignment);

// Get assignments for a course
router.get('/', protect, getAssignments);

// Update an assignment
router.put('/:id', protect, updateAssignment);

// Delete an assignment
router.delete('/:id', protect, deleteAssignment);

module.exports = router;