const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const protect = (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    // Prefer RFC6750 Bearer header
    token = authHeader.slice(7).trim();
  } else if (req.header('x-auth-token')) {
    // Backward-compat header for older clients
    token = req.header('x-auth-token');
  }

  if (!token) {
    return res.status(401).json({ error: 'unauthorized', message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized', message: 'Invalid token' });
  }
};

const checkRole = (allowed = []) => (req, res, next) => {
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'forbidden', message: 'Insufficient role' });
  }
  next();
};

module.exports = { protect, checkRole };