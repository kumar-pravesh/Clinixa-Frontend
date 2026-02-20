const authService = require('../services/auth.service');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.login(email, password);

        // CRITICAL: Block patient role from staff portal
        if (data.user.role === 'patient') {
            return res.status(403).json({
                message: 'Access denied. This portal is for hospital staff only.'
            });
        }

        // Set cookies for both tokens (Staff portal uses mostly cookies)
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
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
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });
    // Also clear without path just in case
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.json({ message: 'Logged out successfully' });
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'Refresh Token Required' });

        const data = await authService.refreshToken(token);

        // Update both cookies
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
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
        res.status(403).json({ message: 'Invalid Refresh Token' });
    }
};

const checkAuth = (req, res) => {
    // If middleware passed, user is authenticated
    // User info is in req.user
    if (req.user) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        // Should be caught by authenticateToken middleware but for safety:
        res.status(401).json({ isAuthenticated: false });
    }
};

module.exports = {
    login,
    logout,
    refreshToken,
    checkAuth
};
