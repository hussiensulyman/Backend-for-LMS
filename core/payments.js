const logger = require('./logger');
const { dbType, paymentProvider } = require('../config/env');

let provider;
function getProvider() {
  if (!provider) {
    const providerName = paymentProvider || process.env.PAYMENT_PROVIDER || 'stripe';
    try {
      // Lazily resolve provider so config/env can decide the implementation
      provider = require(`./payments-provider-${providerName}`);
    } catch (err) {
      logger.error(`Payment provider ${providerName} not found: ${err.message}`);
      throw err;
    }
  }
  return provider;
}

module.exports = {
  createPaymentIntent: (opts) => getProvider().createPaymentIntent(opts),
  createSubscription: (opts) => getProvider().createSubscription(opts),
  verifyWebhook: (req, headers) => getProvider().verifyWebhook(req, headers),
};