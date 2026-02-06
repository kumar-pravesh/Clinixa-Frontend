const { pool } = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = {
    register,
    login,
    refreshToken,
};
