const paymentsService = require('../services/paymentsService');
const corePayments = require('../../../core/payments');
const PaymentRepo = require('../models/PaymentRepo');

jest.mock('../../../core/payments');
jest.mock('../models/PaymentRepo');

test('createPaymentIntent uses provider and creates transaction', async () => {
  corePayments.createPaymentIntent.mockResolvedValue({ id: 'pi_123', amount: 1000, currency: 'usd' });
  PaymentRepo.createTransaction.mockResolvedValue({ id: 1, providerId: 'pi_123' });

  const result = await paymentsService.createPaymentIntent({ amount: 1000, currency: 'usd', metadata: { userId: 1 } });

  expect(corePayments.createPaymentIntent).toHaveBeenCalled();
  expect(PaymentRepo.createTransaction).toHaveBeenCalledWith(expect.objectContaining({ providerId: 'pi_123' }));
  expect(result).toHaveProperty('id', 'pi_123');
});