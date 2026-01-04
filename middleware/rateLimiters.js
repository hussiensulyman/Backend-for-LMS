const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  // Throttle brute-force against auth endpoints
  message: { error: 'too_many_requests', message: 'Too many login attempts, please try again later.' },
});

const paymentsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  // Cap payment intent/subscription creation bursts
  message: { error: 'too_many_requests', message: 'Too many payment requests, please slow down.' },
});

module.exports = { loginLimiter, paymentsLimiter };