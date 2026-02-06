const PaymentProvider = require('./payment.interface');

class RazorpayProvider extends PaymentProvider {
    async initiate(amount, currency, metadata) {
        console.log('[RazorpayProvider] STUB: Initiate payment');
        // In real implementation: razorpay.orders.create(...)
        return {
            transactionId: 'razorpay_order_stub',
            payload: {}
        };
    }

    async verify(transactionId, verificationData) {
        console.log('[RazorpayProvider] STUB: Verify payment');
        return false;
    }
}

module.exports = new RazorpayProvider();
