const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const resetAdminPassword = async () => {
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

        const email = 'admin@clinixa.life';
        const newPassword = 'Password@123';

        console.log(`🔒 Generatng hash for password: ${newPassword}`);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        console.log(`👤 Updating password for user: ${email}`);
        const [result] = await connection.query(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [passwordHash, email]
        );

        if (result.matchedRows === 0) {
            console.log('⚠️  Admin user not found! Creating one now...');
            await connection.query(
                'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
                ['System Admin', email, passwordHash, 'admin', 'Active']
            );
            console.log('✅ Admin user created successfully.');
        } else {
            console.log('✅ Admin password updated successfully.');
        }

        console.log('\n=============================================');
        console.log('🎉 Login Credentials:');
        console.log(`   Email:    ${email}`);
        console.log(`   Password: ${newPassword}`);
        console.log('=============================================');

    } catch (err) {
        console.error('❌ Error resetting password:', err.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

resetAdminPassword();
