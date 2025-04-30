const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadResource } = require('../controllers/resourceController');

const router = express.Router();

router.post('/:courseId/resources', protect, uploadResource);

module.exports = router;