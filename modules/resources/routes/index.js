const express = require('express');
const { protect, checkRole } = require('../../../middleware/auth');
const { uploadResource } = require('../controllers/resourceController');

const router = express.Router();

router.post('/:courseId/resources', protect, checkRole(['admin', 'instructor']), uploadResource);

module.exports = router;
