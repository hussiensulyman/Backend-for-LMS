const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');
const router = express.Router();

// Create notification (Admin/Instructor)
router.post('/create', protect, async (req, res) => {
  const { title, message, courseId, userId } = req.body;

  try {
    const newNotification = new Notification({
      title,
      message,
      courseId,
      userId,
    });

    await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (err) {
    console.error('Error creating notification', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications for a user (Student/Instructor/Admin)
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate('courseId', 'name')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
