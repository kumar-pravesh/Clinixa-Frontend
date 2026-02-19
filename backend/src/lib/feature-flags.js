/**
 * Feature Flags — Simple in-memory feature gating.
 * 
 * All flags default to true (features enabled).
 * Override via environment variables.
 * No .env modification required — these are optional env vars.
 */

const parseFlag = (envValue, defaultValue = true) => {
    if (envValue === undefined || envValue === null || envValue === '') return defaultValue;
    return envValue === 'true' || envValue === '1';
};

const featureFlags = {
    get ENABLE_REGISTRATION_OTP() {
        return parseFlag(process.env.ENABLE_REGISTRATION_OTP, true);
    },

    get ENABLE_TRANSACTIONAL_EMAILS() {
        return parseFlag(process.env.ENABLE_TRANSACTIONAL_EMAILS, true);
    },

    get ENABLE_REMINDER_SCHEDULER() {
        return parseFlag(process.env.ENABLE_REMINDER_SCHEDULER, true);
    },

    get ENABLE_FORGOT_PASSWORD_LINK() {
        return parseFlag(process.env.ENABLE_FORGOT_PASSWORD_LINK, true);
    },

    /**
     * Check if a feature is enabled
     * @param {string} flagName 
     * @returns {boolean}
     */
    isEnabled(flagName) {
        return this[flagName] ?? true;
    }
};

module.exports = featureFlags;
