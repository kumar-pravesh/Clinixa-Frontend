const authService = require('../services/auth.service');
const featureFlags = require('../lib/feature-flags');

const register = async (req, res) => {
    try {

        // When OTP registration is enabled, block direct registration
        if (featureFlags.ENABLE_REGISTRATION_OTP) {
            return res.status(400).json({
                message: 'Please use OTP verification to register.',
                useOtp: true,
                otpEndpoint: '/auth/register/send-otp'
            });
        }

        const {
            name, email, password, gender, dob, phone,
            height, weight, bp_systolic, bp_diastolic, blood_group
        } = req.body;

        const healthData = { height, weight, bp_systolic, bp_diastolic, blood_group };

        const user = await authService.register(name, email, password, gender, dob, phone, healthData);

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.login(email, password);

        // Set HTTP-only cookies for both tokens
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        res.cookie('accessToken', data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.json({ user: data.user, accessToken: data.accessToken });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('refreshToken', { path: '/' });
    res.clearCookie('accessToken', { path: '/' });
    res.json({ message: 'Logged out successfully' });
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'Refresh Token Required' });

        const data = await authService.refreshToken(token);

        // Reset cookie with new refresh token
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ user: data.user, accessToken: data.accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid Refresh Token' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await authService.resetPassword(email, otp, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const googleAuth = async (req, res) => {
    try {
        const data = await authService.googleAuth(req.body);

        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ user: data.user, accessToken: data.accessToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const sendRegistrationOtp = async (req, res) => {
    try {
        const {
            name, email, password, gender, dob, phone,
            height, weight, bp_systolic, bp_diastolic, blood_group
        } = req.body;

        const healthData = { height, weight, bp_systolic, bp_diastolic, blood_group };
        const result = await authService.sendRegistrationOtp({
            name, email, password, gender, dob, phone, healthData
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const verifyRegistrationOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await authService.verifyRegistrationOtp(email, otp);

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    googleAuth,
    sendRegistrationOtp,
    verifyRegistrationOtp
};
