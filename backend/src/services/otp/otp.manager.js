/**
 * OTP Manager — In-memory OTP storage with generation, verification, and cleanup.
 * 
 * Used for registration OTP flow. Does NOT modify the database during OTP lifecycle.
 * The user is only created AFTER OTP verification succeeds.
 */
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const constants = require('./otp.constants');

class OTPManager {
    constructor() {
        /** @type {Map<string, OTPRecord>} email -> OTP record */
        this.otpStore = new Map();

        /** @type {Map<string, RateRecord>} email -> request rate record */
        this.requestRates = new Map();

        // Periodic cleanup of expired entries
        this._cleanupInterval = setInterval(() => this._cleanup(), constants.CLEANUP_INTERVAL_MS);
        if (this._cleanupInterval.unref) this._cleanupInterval.unref();
    }

    /**
     * Generate and store an OTP for a registration attempt.
     * @param {string} email 
     * @param {object} registrationPayload - { name, email, password, gender, dob, phone }
     * @returns {{ success: boolean, otp?: string, error?: string }}
     */
    async generateOTP(email) {
        const normalizedEmail = email.toLowerCase().trim();

        // Check per-email rate limit
        if (!this._checkRequestRate(normalizedEmail)) {
            return { success: false, error: 'Too many OTP requests. Please wait before trying again.' };
        }

        // Purge if map is too large
        if (this.otpStore.size > constants.MAX_MAP_SIZE) {
            this._purgeOldest();
        }

        // Generate OTP
        const otp = String(crypto.randomInt(100000, 999999));
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Store (overwrites any existing OTP for this email)
        this.otpStore.set(normalizedEmail, {
            hashedOtp,
            expiresAt: Date.now() + constants.OTP_EXPIRY_MS,
            attempts: 0,
            lastAttemptAt: 0,
            createdAt: Date.now()
        });

        console.log(`[OTPManager] OTP generated for ${normalizedEmail.substring(0, 3)}***`);
        return { success: true, otp };
    }

    /**
     * Store registration payload separately after OTP generation.
     * @param {string} email 
     * @param {object} payload - { name, hashedPassword, gender, dob, phone }
     */
    setRegistrationPayload(email, payload) {
        const normalizedEmail = email.toLowerCase().trim();
        const record = this.otpStore.get(normalizedEmail);
        if (record) {
            record.pendingRegistration = payload;
        }
    }

    /**
     * Verify an OTP submission.
     * @param {string} email 
     * @param {string} submittedOtp 
     * @returns {{ success: boolean, error?: string, registrationPayload?: object }}
     */
    async verifyOTP(email, submittedOtp) {
        const normalizedEmail = email.toLowerCase().trim();
        const record = this.otpStore.get(normalizedEmail);

        if (!record) {
            return { success: false, error: 'Invalid or expired OTP' };
        }

        // Check expiry
        if (Date.now() > record.expiresAt) {
            this.otpStore.delete(normalizedEmail);
            return { success: false, error: 'OTP has expired. Please request a new one.' };
        }

        // Check inter-attempt delay
        if (record.lastAttemptAt && (Date.now() - record.lastAttemptAt) < constants.MIN_INTER_ATTEMPT_MS) {
            return { success: false, error: 'Please wait before trying again.' };
        }

        // Increment attempts
        record.attempts++;
        record.lastAttemptAt = Date.now();

        // Check max attempts
        if (record.attempts > constants.MAX_VERIFICATION_ATTEMPTS) {
            this.otpStore.delete(normalizedEmail);
            console.warn(`[OTPManager] Max attempts exceeded for ${normalizedEmail.substring(0, 3)}***`);
            return { success: false, error: 'Too many incorrect attempts. Please request a new OTP.' };
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(submittedOtp, record.hashedOtp);

        if (!isMatch) {
            const remaining = constants.MAX_VERIFICATION_ATTEMPTS - record.attempts;
            return { success: false, error: `Invalid OTP. ${remaining} attempt(s) remaining.` };
        }

        // Success — extract payload and clean up
        const registrationPayload = record.pendingRegistration;
        this.otpStore.delete(normalizedEmail);

        console.log(`[OTPManager] OTP verified for ${normalizedEmail.substring(0, 3)}***`);
        return { success: true, registrationPayload };
    }

    /**
     * Check per-email request rate.
     * @private
     */
    _checkRequestRate(email) {
        const now = Date.now();
        let record = this.requestRates.get(email);

        if (!record || now - record.windowStart > constants.OTP_REQUEST_WINDOW_MS) {
            record = { count: 0, windowStart: now };
            this.requestRates.set(email, record);
        }

        record.count++;
        return record.count <= constants.MAX_OTP_REQUESTS_PER_EMAIL;
    }

    /**
     * Remove expired entries.
     * @private
     */
    _cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [email, record] of this.otpStore.entries()) {
            if (now > record.expiresAt) {
                this.otpStore.delete(email);
                cleaned++;
            }
        }

        for (const [email, record] of this.requestRates.entries()) {
            if (now - record.windowStart > constants.OTP_REQUEST_WINDOW_MS) {
                this.requestRates.delete(email);
            }
        }

        if (cleaned > 0) {
            console.log(`[OTPManager] Cleaned ${cleaned} expired OTP entries`);
        }
    }

    /**
     * Purge oldest 50% of entries when map overflows.
     * @private
     */
    _purgeOldest() {
        const entries = [...this.otpStore.entries()]
            .sort((a, b) => a[1].createdAt - b[1].createdAt);

        const toRemove = Math.floor(entries.length / 2);
        for (let i = 0; i < toRemove; i++) {
            this.otpStore.delete(entries[i][0]);
        }
        console.warn(`[OTPManager] Purged ${toRemove} entries (map overflow protection)`);
    }
}

module.exports = new OTPManager();
