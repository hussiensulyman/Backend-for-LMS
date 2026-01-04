const { dbType } = require('../../../config/env');

if (dbType === 'mysql') {
  const { prisma } = require('../../../core/prisma');

  module.exports = {
    async createTransaction(data) {
      return prisma.paymentTransaction.create({ data });
    },
    async updateTransactionByProviderId(providerId, data) {
      return prisma.paymentTransaction.update({ where: { providerId }, data });
    },
    async createSubscription(data) {
      return prisma.subscription.create({ data });
    },
    async findTransactionsByUser(userId) {
      return prisma.paymentTransaction.findMany({ where: { userId: Number(userId) } });
    },
  };
} else {
  // Mongoose fallback
  const mongoose = require('mongoose');
  const { Schema } = mongoose;

  const txSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    provider: String,
    providerId: { type: String, unique: true },
    amount: Number,
    currency: String,
    status: String,
    meta: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  });

  const subSchema = new Schema({
    provider: String,
    providerId: String,
    customerId: String,
    priceId: String,
    status: String,
    createdAt: { type: Date, default: Date.now },
  });

  const Tx = mongoose.models.PaymentTransaction || mongoose.model('PaymentTransaction', txSchema);
  const Sub = mongoose.models.Subscription || mongoose.model('Subscription', subSchema);

  module.exports = {
    async createTransaction(data) {
      const t = new Tx(data);
      return t.save();
    },
    async updateTransactionByProviderId(providerId, data) {
      return Tx.findOneAndUpdate({ providerId }, data, { new: true });
    },
    async createSubscription(data) {
      const s = new Sub(data);
      return s.save();
    },
    async findTransactionsByUser(userId) {
      return Tx.find({ userId });
    },
  };
}