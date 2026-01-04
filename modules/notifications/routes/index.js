const express = require('express');
const { protect, checkRole } = require('../../../middleware/auth');
const { createNotification, getNotifications } = require('../controllers/notificationsController');

const router = express.Router();

router.post('/create', protect, checkRole(['admin', 'instructor']), createNotification);
router.get('/', protect, getNotifications);

module.exports = router;
