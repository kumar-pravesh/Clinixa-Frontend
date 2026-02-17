const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/user.model');
const PatientModel = require('../models/patient.model');
const DoctorModel = require('../models/doctor.model');
// Note: NotificationService import will need to be updated once it's moved
// For now, we'll try to require it from the old location or stub it if moving later
// The plan says "Migrate remaining modules progressively", so NotificationService is still in modules
const notificationService = require('./notification.service');

const generateTokens = (user, extraClaims = {}) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role, name: user.name, ...extraClaims },
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
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create User
        const userId = await UserModel.create({
            name,
            email,
            password_hash: passwordHash,
            role: 'patient'
        }, connection);

        const user = { id: userId, name, role: 'patient' };

        // Create Patient Profile
        await PatientModel.create({
            user_id: userId,
            name,
            dob,
            gender,
            phone
        }, connection);

        await connection.commit();

        // Send Welcome Notification
        notificationService.sendWelcomeNotification(email, name, phone).catch(err =>
            console.error('[Auth] Failed to send welcome notification:', err.message)
        );

        return user;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const login = async (email, password) => {
    const user = await UserModel.findByEmail(email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    let extraClaims = {};
    let doctorId = null;

    if (user.role === 'doctor') {
        const doctor = await DoctorModel.findByUserId(user.id);
        if (doctor) {
            extraClaims.doctorId = doctor.id;
            doctorId = doctor.id;
        }
    }

    const tokens = generateTokens(user, extraClaims);
    return {
        user: {
            id: user.id,
            name: user.name,
            role: user.role,
            doctorId: doctorId
        },
        ...tokens
    };
};

const refreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        let extraClaims = {};
        let doctorId = null;

        if (user.role === 'doctor') {
            const doctor = await DoctorModel.findByUserId(user.id);
            if (doctor) {
                extraClaims.doctorId = doctor.id;
                doctorId = doctor.id;
            }
        }

        return {
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                doctorId: doctorId
            },
            ...generateTokens(user, extraClaims)
        };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

const forgotPassword = async (email) => {
    const user = await UserModel.findByEmail(email);

    if (!user) {
        throw new Error('User with this email does not exist');
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await UserModel.updateResetToken(user.id, otpHash, expires);

    // Send email
    try {
        await notificationService.sendOTP(email, otp);
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw new Error('Failed to send email. Please check configuration.');
    }

    return { message: 'OTP sent to email' };
};

const resetPassword = async (email, otp, newPassword) => {
    const user = await UserModel.findByEmail(email);

    if (!user || !user.reset_token) {
        throw new Error('Reset request not found');
    }

    if (new Date(user.reset_token_expires) < new Date()) {
        throw new Error('OTP expired');
    }

    const isMatch = await bcrypt.compare(otp, user.reset_token);
    if (!isMatch) {
        throw new Error('Invalid OTP');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await UserModel.confirmPasswordReset(user.id, passwordHash);

    return { message: 'Password reset successful' };
};

// Google Auth would require slightly more logic in Model (createOrUpdate), skipping for now to keep it simple
// or implementing simplified version
const googleAuth = async (googleUser) => {
    const { email, name } = googleUser;
    let user = await UserModel.findByEmail(email);

    if (!user) {
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        const userId = await UserModel.create({
            name,
            email,
            password_hash: passwordHash,
            role: 'patient'
        });

        // Create patient profile (Transaction ideal here too but skipping for parity with original)
        // Original code didn't use transaction for Google Auth create? actually it did use pool.query sequentially 
        // cleanly but without explicit BEGIN/COMMIT.
        await PatientModel.create({
            user_id: userId,
            name,
            email
        });
    }

    // Re-fetch to be sure
    if (!user) user = await UserModel.findByEmail(email);

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
