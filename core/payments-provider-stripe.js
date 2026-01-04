const Stripe = require('stripe');
const { stripeSecret, stripeWebhookSecret } = require('../config/env');
const stripe = new Stripe(stripeSecret || process.env.STRIPE_SECRET);

module.exports = {
  async createPaymentIntent({ amount, currency = 'usd', metadata = {} }) {
    const pi = await stripe.paymentIntents.create({ amount, currency, metadata });
    return pi;
  },

  async createSubscription({ customerId, priceId }) {
    const sub = await stripe.subscriptions.create({ customer: customerId, items: [{ price: priceId }] });
    return sub;
  },

  verifyWebhook(req, headers) {
    const sig = headers['stripe-signature'] || headers['Stripe-Signature'] || headers['stripe_signature'];
    const raw = req.rawBody || req.body;
    // Stripe requires the exact raw payload plus the signature header to construct the event
    if (!sig) throw new Error('Missing stripe signature header');

    try {
      const event = stripe.webhooks.constructEvent(raw, sig, stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET);
      return event;
    } catch (err) {
      err.status = 400;
      throw err;
    }
  },
};