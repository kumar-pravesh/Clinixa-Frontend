const Razorpay = require('razorpay');
const crypto = require('crypto');
const PaymentProvider = require('./payment.interface');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

class RazorpayProvider extends PaymentProvider {
    async initiate(amount, currency, metadata) {
        try {
            const order = await razorpay.orders.create({
                amount: Math.round(amount * 100), // paise, ensure integer
                currency,
                receipt: `appt_${metadata.appointmentId}`,
                payment_capture: 1
            });

            return {
                transactionId: order.id,
                payload: {
                    provider: 'razorpay',
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    key: process.env.RAZORPAY_KEY_ID
                }
            };
        } catch (error) {
            console.error('Razorpay Error:', error);
            throw new Error(`Razorpay Error: ${error.statusCode} ${error.plugin?.name || ''} - ${error.error?.description || error.message}`);
        }
    }

    async verify(transactionId, verificationData) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = verificationData;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        return expectedSignature === razorpay_signature;
    }
}

module.exports = new RazorpayProvider();
