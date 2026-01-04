const express = require('express');
const { protect } = require('../../../middleware/auth');
const { getProgress } = require('../controllers/progressController');

const router = express.Router();

router.get('/test', (req, res) => res.json({ ok: true }));
router.get('/:courseId/progress', protect, getProgress);

module.exports = router;
