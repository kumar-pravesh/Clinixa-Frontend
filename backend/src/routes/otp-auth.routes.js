/**
 * OTP Auth Routes — Registration with OTP verification.
 * 
 * These are ADDITIVE routes. The existing /auth/register remains functional.
 */
const express = require('express');
const router = express.Router();
const otpAuthController = require('../controllers/otp-auth.controller');
const forgotPasswordController = require('../controllers/forgot-password.controller');
const { createRateLimiter } = require('../middlewares/rate-limiter.middleware');

// Rate limiters for OTP routes
const sendOtpLimiter = createRateLimiter({
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'otp-send',
    message: 'Too many OTP requests. Please try again later.'
});

const verifyOtpLimiter = createRateLimiter({
    maxRequests: 20,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'otp-verify',
    message: 'Too many verification attempts. Please try again later.'
});

const forgotPasswordLimiter = createRateLimiter({
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'forgot-pwd',
    message: 'Too many password reset requests. Please try again later.'
});

const resetPasswordLimiter = createRateLimiter({
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'reset-pwd',
    message: 'Too many reset attempts. Please try again later.'
});

// Registration OTP flow
router.post('/register/send-otp', sendOtpLimiter, otpAuthController.sendOtp);
router.post('/register/verify-otp', verifyOtpLimiter, otpAuthController.verifyOtp);

// Enhanced forgot password with JWT reset link
router.post('/forgot-password-link', forgotPasswordLimiter, forgotPasswordController.forgotPasswordLink);
router.post('/reset-password-link', resetPasswordLimiter, forgotPasswordController.resetPasswordLink);

module.exports = router;
