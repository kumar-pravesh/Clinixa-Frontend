const PaymentProvider = require('./payment.interface');
const { v4: uuidv4 } = require('uuid');

class MockPaymentProvider extends PaymentProvider {
    async initiate(amount, currency, metadata) {
        console.log(`[MockProvider] Initiating payment of ${amount} ${currency}`);
        const transactionId = 'mock_' + uuidv4();
        return {
            transactionId,
            payload: {
                confirmUrl: '/mock-payment-gateway' // Frontend will handle this
            }
        };
    }

    async verify(transactionId, verificationData) {
        const status = verificationData.status || verificationData;
        console.log(`[MockProvider] Verifying payment ${transactionId} with status ${status}`);
        return status === 'SUCCESS';
    }
}

module.exports = new MockPaymentProvider();
