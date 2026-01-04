const notificationsService = require('../services/notificationsService');

exports.createNotification = async (req, res) => {
  try {
    const notification = await notificationsService.createNotification(req.body);
    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationsService.getNotificationsForUser(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
