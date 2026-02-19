const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const forgotPasswordController = require('../controllers/forgot-password.controller');
const featureFlags = require('../lib/feature-flags');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/register/send-otp', authController.sendRegistrationOtp);
router.post('/register/verify-otp', authController.verifyRegistrationOtp);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Forgot password: delegates to JWT link flow when enabled, falls back to old OTP flow
router.post('/forgot-password', (req, res, next) => {
    if (featureFlags.ENABLE_FORGOT_PASSWORD_LINK) {
        return forgotPasswordController.forgotPasswordLink(req, res, next);
    }
    return authController.forgotPassword(req, res, next);
});

router.post('/reset-password', (req, res, next) => {
    if (featureFlags.ENABLE_FORGOT_PASSWORD_LINK) {
        return forgotPasswordController.resetPasswordLink(req, res, next);
    }
    return authController.resetPassword(req, res, next);
});

router.post('/google', authController.googleAuth);

module.exports = router;
