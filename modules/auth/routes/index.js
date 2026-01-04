const express = require('express');
const { register, login } = require('../controllers/authController');
const { loginLimiter } = require('../../../middleware/rateLimiters');

const router = express.Router();

router.post('/register', loginLimiter, register);
router.post('/login', loginLimiter, login);

module.exports = router;
