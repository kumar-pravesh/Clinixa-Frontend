/**
 * OTP Constants
 */
module.exports = {
    OTP_LENGTH: 6,
    OTP_EXPIRY_MS: 5 * 60 * 1000,         // 5 minutes
    MAX_VERIFICATION_ATTEMPTS: 5,
    MIN_INTER_ATTEMPT_MS: 1000,             // 1 second between attempts
    MAX_OTP_REQUESTS_PER_EMAIL: 3,          // per 15-minute window
    OTP_REQUEST_WINDOW_MS: 15 * 60 * 1000,  // 15 minutes
    MAX_MAP_SIZE: 10000,                     // max pending OTPs before purge
    CLEANUP_INTERVAL_MS: 60 * 1000          // 1-minute cleanup cycle
};
