const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const resetPatientPassword = async () => {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'hospital_db',
            port: process.env.DB_PORT || 3306
        });

        const email = 'john.doe@email.com';
        const newPassword = 'Password@123';

        console.log(`🔒 Generatng hash for password: ${newPassword}`);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        console.log(`👤 Checking/Updating password for user: ${email}`);

        // Check if user exists
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.log('⚠️  Patient user not found! Creating one now...');
            // Create user
            const [userResult] = await connection.query(
                'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
                ['John Doe', email, passwordHash, 'patient', 'Active']
            );
            const userId = userResult.insertId;

            // Create patient profile
            await connection.query(
                'INSERT INTO patients (user_id, name, email, phone, gender, dob) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, 'John Doe', email, '9876543210', 'Male', '1990-01-01']
            );
            console.log('✅ Patient user and profile created successfully.');
        } else {
            // Update password
            await connection.query(
                'UPDATE users SET password_hash = ? WHERE email = ?',
                [passwordHash, email]
            );
            console.log('✅ Patient password updated successfully.');
        }

        console.log('\n=============================================');
        console.log('🎉 Patient Login Credentials:');
        console.log(`   Email:    ${email}`);
        console.log(`   Password: ${newPassword}`);
        console.log('=============================================');

    } catch (err) {
        console.error('❌ Error resetting patient password:', err.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

resetPatientPassword();
