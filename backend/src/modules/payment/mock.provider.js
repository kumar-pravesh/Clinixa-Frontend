const PaymentProvider = require('./payment.interface');
const { v4: uuidv4 } = require('uuid'); // Assume uuid is not installed, use random string

class MockPaymentProvider extends PaymentProvider {
    async initiate(amount, currency, metadata) {
        console.log(`[MockProvider] Initiating payment of ${amount} ${currency}`);
        // Simulate a transaction ID
        const transactionId = 'mock_txn_' + Math.random().toString(36).substring(7);
        return {
            transactionId,
            payload: {
                confirmUrl: '/mock-payment-gateway' // Frontend will handle this
            }
        };
    }

    async verify(transactionId, status) {
        console.log(`[MockProvider] Verifying payment ${transactionId} with status ${status}`);
        return status === 'SUCCESS';
    }
}

module.exports = new MockPaymentProvider();
