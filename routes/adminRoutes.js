const express = require('express');
const { protect } = require('../middleware/auth');
const { getAnalytics } = require('../controllers/adminController');

const router = express.Router();

router.get('/analytics', protect, getAnalytics);

module.exports = router;