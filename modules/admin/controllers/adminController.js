const adminService = require('../services/adminService');
const logger = require('../../../utils/logger');

exports.getAnalytics = async (req, res) => {
  try {
    const data = await adminService.getAnalytics();
    res.json(data);
  } catch (err) {
    logger.error(`Error in getAnalytics: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};