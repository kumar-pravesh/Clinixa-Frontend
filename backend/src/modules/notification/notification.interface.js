class NotificationProvider {
    /**
     * Send a notification
     * @param {string} recipient - Email or Phone number
     * @param {string} message - Content of the notification
     * @param {string} subject - Subject (for emails)
     */
    async send(recipient, message, subject) {
        throw new Error('Method not implemented');
    }
}

module.exports = NotificationProvider;
