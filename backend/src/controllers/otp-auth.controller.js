/**
 * OTP Auth Controller — Two-phase registration with email OTP verification.
 * 
 * Phase 1: POST /send-otp — Validate fields, generate OTP, send email
 * Phase 2: POST /verify-otp — Verify OTP, call original auth.service.register
 * 
 * The existing POST /auth/register remains functional and unchanged.
 */
const authService = require('../services/auth.service');
const otpManager = require('../services/otp/otp.manager');
const emailDispatcher = require('../services/email/email.dispatcher');
const UserModel = require('../models/user.model');
const featureFlags = require('../lib/feature-flags');

/**
 * Phase 1: Send Registration OTP
 * POST /auth/register/send-otp
 * Body: { name, email, password, gender, dob, phone }
 */
const sendOtp = async (req, res) => {
    try {
        if (!featureFlags.ENABLE_REGISTRATION_OTP) {
            return res.status(404).json({ message: 'Not found' });
        }

        const { name, email, password, gender, dob, phone } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 254) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user already exists (silently — no enumeration)
        const existingUser = await UserModel.findByEmail(email);

        // Generate OTP regardless (prevent timing attack)
        const result = await otpManager.generateOTP(email);

        if (!result.success) {
            return res.status(429).json({ message: result.error });
        }

        if (!existingUser) {
            // Store registration payload with raw password
            // Raw password is held in-memory only, for 5-min OTP window, deleted on use
            otpManager.setRegistrationPayload(email, {
                name, email, rawPassword: password, gender, dob, phone
            });

            // Send OTP email
            emailDispatcher.sendRegistrationOtp(email, name, result.otp).catch(err => {
                console.error('[OTP-Auth] Failed to send OTP email:', err.message);
            });
        }
        // If user exists, we still return success (no enumeration)
        // but no OTP is usable since we didn't store a real payload

        res.json({ message: 'OTP sent to email. Please check your inbox.' });
    } catch (error) {
        console.error('[OTP-Auth] sendOtp error:', error.message);
        res.status(500).json({ message: 'Failed to process request' });
    }
};

/**
 * Phase 2: Verify OTP and Complete Registration
 * POST /auth/register/verify-otp
 * Body: { email, otp }
 */
const verifyOtp = async (req, res) => {
    try {
        if (!featureFlags.ENABLE_REGISTRATION_OTP) {
            return res.status(404).json({ message: 'Not found' });
        }

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Verify OTP
        const result = await otpManager.verifyOTP(email, otp);

        if (!result.success) {
            return res.status(400).json({ message: result.error });
        }

        const payload = result.registrationPayload;

        if (!payload) {
            // This happens if user already existed when OTP was sent
            return res.status(400).json({ message: 'Registration could not be completed. Please try again.' });
        }

        // Call the ORIGINAL auth.service.register — completely unmodified
        const user = await authService.register(
            payload.name,
            payload.email,
            payload.rawPassword,
            payload.gender,
            payload.dob,
            payload.phone
        );

        res.status(201).json({ message: 'Registration successful', user });
    } catch (error) {
        console.error('[OTP-Auth] verifyOtp error:', error.message);

        // Pass through known errors from auth.service
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};

module.exports = { sendOtp, verifyOtp };
