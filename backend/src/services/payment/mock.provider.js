const NotificationProvider = require('../notification.interface');

class MockPaymentProvider {
    async initiate(amount, currency, metadata) {
        console.log(`[MockPayment] Initiating payment of ${amount} ${currency}`, metadata);
        return {
            transactionId: `mock_txn_${Date.now()}`,
            payload: {
                id: `mock_order_${Date.now()}`,
                amount: amount,
                currency: currency,
                key: 'mock_key'
            }
        };
    }

    async verify(transactionId, data) {
        console.log(`[MockPayment] Verifying transaction ${transactionId}`, data);
        // Always return true for mock
        return true;
    }
}

module.exports = new MockPaymentProvider();
