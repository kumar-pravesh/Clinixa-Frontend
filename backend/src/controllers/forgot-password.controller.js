/**
 * Enhanced Forgot Password Controller — JWT-signed reset links.
 * 
 * Replaces OTP-to-email with a clickable reset link containing a signed JWT.
 * Uses the existing UserModel.updateResetToken and UserModel.confirmPasswordReset methods.
 * Falls back to the original OTP-based flow when ENABLE_FORGOT_PASSWORD_LINK is false.
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const emailDispatcher = require('../services/email/email.dispatcher');
const featureFlags = require('../lib/feature-flags');

/**
 * POST /auth/forgot-password-link
 * Body: { email }
 * 
 * Sends a JWT-signed reset link to the user's email.
 * Response is always the same regardless of whether the email exists.
 */
const forgotPasswordLink = async (req, res) => {
    try {
        if (!featureFlags.ENABLE_FORGOT_PASSWORD_LINK) {
            return res.status(404).json({ message: 'Not found' });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Consistent response message
        const successMessage = 'If an account with that email exists, a reset link has been sent.';

        const user = await UserModel.findByEmail(email);

        if (!user) {
            // Perform dummy bcrypt hash to prevent timing attacks
            await bcrypt.hash('dummy', 10);
            return res.json({ message: successMessage });
        }

        // Generate nonce for one-time-use enforcement
        const nonce = crypto.randomBytes(16).toString('hex');

        // Sign JWT with 15-minute expiry
        const resetToken = jwt.sign(
            { userId: user.id, nonce, purpose: 'password_reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Store nonce in existing reset_token column, expiry in reset_token_expires
        const expires = new Date(Date.now() + 15 * 60 * 1000);
        await UserModel.updateResetToken(user.id, nonce, expires);

        // Build reset URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        // Send email with reset link
        emailDispatcher.sendPasswordResetLink(email, user.name, resetUrl).catch(err => {
            console.error('[ForgotPassword] Failed to send reset email:', err.message);
        });

        res.json({ message: successMessage });
    } catch (error) {
        console.error('[ForgotPassword] forgotPasswordLink error:', error.message);
        res.status(500).json({ message: 'Failed to process request' });
    }
};

/**
 * POST /auth/reset-password-link
 * Body: { token, newPassword }
 * 
 * Verifies the JWT token and resets the password.
 */
const resetPasswordLink = async (req, res) => {
    try {
        if (!featureFlags.ENABLE_FORGOT_PASSWORD_LINK) {
            return res.status(404).json({ message: 'Not found' });
        }

        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(400).json({ message: 'Reset link has expired. Please request a new one.' });
            }
            return res.status(400).json({ message: 'Invalid reset link.' });
        }

        // Check purpose claim
        if (decoded.purpose !== 'password_reset') {
            return res.status(400).json({ message: 'Invalid reset link.' });
        }

        // Fetch user
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ message: 'Invalid reset link.' });
        }

        // Verify nonce matches stored reset_token (one-time-use enforcement)
        if (!user.reset_token || user.reset_token !== decoded.nonce) {
            return res.status(400).json({ message: 'Reset link has already been used or is invalid.' });
        }

        // Verify DB-level expiry as failsafe
        if (new Date(user.reset_token_expires) < new Date()) {
            return res.status(400).json({ message: 'Reset link has expired. Please request a new one.' });
        }

        // Hash new password and update using EXISTING model method
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        await UserModel.confirmPasswordReset(user.id, passwordHash);

        console.log(`[ForgotPassword] Password reset successful for user ${user.id}`);
        res.json({ message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        console.error('[ForgotPassword] resetPasswordLink error:', error.message);
        res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
};

module.exports = { forgotPasswordLink, resetPasswordLink };
