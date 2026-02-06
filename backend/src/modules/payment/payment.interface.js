class PaymentProvider {
    /**
     * Initiate a payment
     * @param {number} amount 
     * @param {string} currency 
     * @param {object} metadata 
     * @returns {Promise<{transactionId: string, payload: any}>}
     */
    async initiate(amount, currency, metadata) {
        throw new Error('Method not implemented');
    }

    /**
     * Verify/Confirm a payment
     * @param {string} transactionId 
     * @param {any} verificationData 
     * @returns {Promise<boolean>}
     */
    async verify(transactionId, verificationData) {
        throw new Error('Method not implemented');
    }
}

module.exports = PaymentProvider;
