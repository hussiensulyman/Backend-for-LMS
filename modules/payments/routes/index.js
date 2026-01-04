const express = require('express');
const router = express.Router();
const { createPaymentIntent, createSubscription, webhook } = require('../controllers/paymentsController');
const { paymentsLimiter } = require('../../../middleware/rateLimiters');

// Create a payment intent (rate limited)
router.post('/create-payment-intent', paymentsLimiter, createPaymentIntent);

// Create a subscription (rate limited)
router.post('/subscribe', paymentsLimiter, createSubscription);

// Webhook (Stripe expects raw body; core/app captures raw body on this path)
router.post('/webhook', webhook);

module.exports = router;