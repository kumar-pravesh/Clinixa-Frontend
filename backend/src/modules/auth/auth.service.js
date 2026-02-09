const { pool } = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../../services/emailService');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
};

const register = async (name, email, password, gender, dob, phone) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if user exists
        const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create User
        const userResult = await client.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, role',
            [name, email, passwordHash, 'patient']
        );
        const user = userResult.rows[0];

        // Create Patient Profile
        await client.query(
            'INSERT INTO patients (user_id, dob, gender, phone) VALUES ($1, $2, $3, $4)',
            [user.id, dob, gender, phone]
        );

        await client.query('COMMIT');
        return user;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const login = async (email, password) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const tokens = generateTokens(user);
    return { user: { id: user.id, name: user.name, role: user.role }, ...tokens };
};

const refreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        const user = result.rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        return generateTokens(user);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

const forgotPassword = async (email) => {
    try {
        // Check if user exists
        const result = await pool.query('SELECT id, name FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            // For security, don't reveal if email exists or not
            throw new Error('If this email is registered, you will receive a password reset link');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = await bcrypt.hash(resetToken, 10);
        
        // Set token expiry to 1 hour
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

        // Store reset token in database
        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
            [resetTokenHash, expiryTime, user.id]
        );

        // Send email with reset link
        await sendPasswordResetEmail(email, resetToken, user.name);

        return { message: 'Password reset link sent to your email' };
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (token, newPassword) => {
    try {
        // Find user with matching reset token
        const result = await pool.query(
            'SELECT id, reset_token, reset_token_expiry FROM users WHERE reset_token IS NOT NULL'
        );

        let user = null;
        for (const row of result.rows) {
            // Verify token hash
            const isValidToken = await bcrypt.compare(token, row.reset_token);
            if (isValidToken) {
                user = row;
                break;
            }
        }

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Check if token is expired
        if (new Date() > new Date(user.reset_token_expiry)) {
            throw new Error('Reset token has expired');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        await pool.query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
            [passwordHash, user.id]
        );

        return { message: 'Password reset successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    forgotPassword,
    resetPassword,
};
