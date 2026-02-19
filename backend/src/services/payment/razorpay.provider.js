const Razorpay = require('razorpay');

class RazorpayProvider {
    constructor() {
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            this.instance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            });
        }
    }

    async initiate(amount, currency, metadata) {
        if (!this.instance) throw new Error('Razorpay not configured');

        const options = {
            amount: Math.round(amount * 100), // amount in smallest currency unit
            currency: currency,
            receipt: metadata.receipt,
            notes: metadata
        };

        const order = await this.instance.orders.create(options);
        return {
            transactionId: order.id,
            payload: order
        };
    }

    async verify(transactionId, data) {
        if (!this.instance) throw new Error('Razorpay not configured');

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        return generated_signature === razorpay_signature;
    }

    async refund(paymentId, amount) {
        if (!this.instance) throw new Error('Razorpay not configured');

        const refund = await this.instance.payments.refund(paymentId, {
            amount: Math.round(amount * 100), // amount in smallest currency unit
            speed: 'normal'
        });

        return {
            refundId: refund.id,
            status: refund.status
        };
    }
}

module.exports = new RazorpayProvider();
