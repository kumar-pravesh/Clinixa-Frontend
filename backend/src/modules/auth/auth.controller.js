const authService = require('./auth.service');

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

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken: tokens.accessToken });
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

module.exports = {
    register,
    login,
    refresh,
    logout
};
