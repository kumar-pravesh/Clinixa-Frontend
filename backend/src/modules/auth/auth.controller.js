const authService = require('./auth.service');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password, gender, dob, phone } = req.body;
        await authService.register(name, email, password, gender, dob, phone);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.login(email, password);

        // Set Refresh Token as Netscapcookie
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ user: data.user, accessToken: data.accessToken });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw new Error('Refresh token missing');

        const tokens = await authService.refreshToken(refreshToken);

        // Fetch user info to return with accessToken
        const decoded = jwt.decode(tokens.accessToken);
        const user = { id: decoded.id, role: decoded.role, name: decoded.name };

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken: tokens.accessToken, user });
    } catch (error) {
        console.error('Refresh token error:', error.message);
        res.status(403).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
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
        const { token } = req.body;
        // In a real app, we'd verify the token with Google here
        // For now, we'll assume the client sends the payload (simulated)
        // or we'd use a library like google-auth-library

        let decoded;
        try {
            decoded = jwt.decode(token);
        } catch (e) {
            // Ignore jwt error, try generic base64
        }

        if (!decoded) {
            try {
                // Handle the mock btoa(JSON) token from frontend
                decoded = JSON.parse(Buffer.from(token, 'base64').toString());
            } catch (e) {
                throw new Error('Invalid token format');
            }
        }

        const data = await authService.googleAuth({
            email: decoded.email,
            name: decoded.name,
            googleId: decoded.sub
        });

        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user: data.user, accessToken: data.accessToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    googleAuth
};
