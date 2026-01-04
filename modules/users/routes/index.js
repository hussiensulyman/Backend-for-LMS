const express = require('express');
const { protect, checkRole } = require('../../../middleware/auth');
const { getUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/', protect, checkRole(['admin']), getUsers);

module.exports = router;
