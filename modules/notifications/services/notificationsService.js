const Notification = require('../models/Notification');

module.exports = {
  async createNotification(data) {
    const n = new Notification(data);
    return n.save();
  },

  async getNotificationsForUser(userId) {
    return Notification.find({ userId }).sort({ createdAt: -1 });
  },
};
