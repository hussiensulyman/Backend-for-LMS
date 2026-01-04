const corePayments = require('../../../core/payments');
const PaymentRepo = require('../models/PaymentRepo');

module.exports = {
  async createPaymentIntent({ amount, currency = 'usd', metadata = {} }) {
    // amount should be in the smallest currency unit (e.g., cents)
    const intent = await corePayments.createPaymentIntent({ amount, currency, metadata });
    // create a transaction record
    await PaymentRepo.createTransaction({ provider: 'stripe', providerId: intent.id, amount, currency, status: 'requires_payment_method', meta: { ...metadata } });
    return intent;
  },

  async createSubscription({ customerId, priceId }) {
    const sub = await corePayments.createSubscription({ customerId, priceId });
    await PaymentRepo.createSubscription({ provider: 'stripe', providerId: sub.id, customerId, priceId, status: sub.status });
    return sub;
  },

  async handleWebhook(req) {
    const event = corePayments.verifyWebhook(req, req.headers);
    // Basic processing examples
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      await PaymentRepo.updateTransactionByProviderId(pi.id, { status: 'succeeded' });
    } else if (event.type === 'invoice.payment_failed') {
      const inv = event.data.object;
      // handle failed invoice
    }
    return event;
  },
};