const { pool } = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if user exists
        const [userCheck] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userCheck.length > 0) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create User
        const [userResult] = await connection.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, passwordHash, 'patient']
        );

        const userId = userResult.insertId;
        const user = { id: userId, name, role: 'patient' };

        // Create Patient Profile
        await connection.query(
            'INSERT INTO patients (user_id, name, dob, gender, phone) VALUES (?, ?, ?, ?, ?)',
            [userId, name, dob, gender, phone]
        );

        await connection.commit();
        return user;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const login = async (email, password) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

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
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
        const user = rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        return generateTokens(user);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

const forgotPassword = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
        throw new Error('User with this email does not exist');
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
        [otpHash, expires, user.id]
    );

    // Send email (Mocked for now if real SMTP not configured)
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Clinixa Health" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
            html: `<b>Your OTP for password reset is: ${otp}</b><p>It expires in 10 minutes.</p>`
        });
    } catch (error) {
        console.error('Email sending failed:', error.message);
        // We still return success of OTP generation for security reasons (don't leak success/fail usually)
        // but for development, we want to know.
        throw new Error('Failed to send email. Please check configuration.');
    }

    return { message: 'OTP sent to email' };
};

const resetPassword = async (email, otp, newPassword) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !user.reset_token) {
        throw new Error('Reset request not found');
    }

    // Check expiry
    if (new Date(user.reset_token_expires) < new Date()) {
        throw new Error('OTP expired');
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, user.reset_token);
    if (!isMatch) {
        throw new Error('Invalid OTP');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await pool.query(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [passwordHash, user.id]
    );

    return { message: 'Password reset successful' };
};

const googleAuth = async (googleUser) => {
    const { email, name, googleId } = googleUser;

    // Check if user exists
    let [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = rows[0];

    if (!user) {
        // Create new user
        // Using a random password since they use Google
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, passwordHash, 'patient']
        );

        const userId = result.insertId;

        // Create patient profile
        await pool.query(
            'INSERT INTO patients (user_id, name, email) VALUES (?, ?, ?)',
            [userId, name, email]
        );

        [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        user = rows[0];
    }

    const tokens = generateTokens(user);
    return { user: { id: user.id, name: user.name, role: user.role }, ...tokens };
};

module.exports = {
    register,
    login,
    refreshToken,
    forgotPassword,
    resetPassword,
    googleAuth
};
