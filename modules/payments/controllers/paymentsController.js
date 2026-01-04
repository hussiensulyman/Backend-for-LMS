const paymentsService = require('../services/paymentsService');
const logger = require('../../../utils/logger');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: 'validation_error', message: 'amount must be a positive integer (smallest currency unit)' });
    }
    // Attach user id in metadata for downstream reconciliation/auditing
    const pi = await paymentsService.createPaymentIntent({ amount, currency, metadata: { userId: req.user?.id } });
    res.json(pi);
  } catch (err) {
    logger.error('Error creating payment intent', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { customerId, priceId } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: 'validation_error', message: 'priceId is required' });
    }
    // Allow optional existing customer id; otherwise provider may create one
    const sub = await paymentsService.createSubscription({ customerId, priceId });
    res.json(sub);
  } catch (err) {
    logger.error('Error creating subscription', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.webhook = async (req, res) => {
  try {
    if (!req.headers['stripe-signature']) {
      return res.status(400).json({ error: 'validation_error', message: 'Missing Stripe-Signature header' });
    }
    // Raw body is captured in app setup; verification happens in the service
    const event = await paymentsService.handleWebhook(req);
    // Process event as needed
    res.json({ received: true, type: event.type });
  } catch (err) {
    logger.error('Webhook error', err);
    res.status(err.status || 400).json({ message: err.message });
  }
};