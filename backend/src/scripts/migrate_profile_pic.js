const mysql = require('mysql2/promise');
require('dotenv').config();

const migrate = async () => {
    let connection;
    try {
        console.log('Connecting to MySQL for migration...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('Checking for profile_pic column...');
        const [rows] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_pic'
        `, [process.env.DB_NAME]);

        if (rows.length === 0) {
            console.log('Adding profile_pic column to users table...');
            await connection.query('ALTER TABLE users ADD COLUMN profile_pic VARCHAR(255)');
            console.log('✅ Migration successful: profile_pic column added.');
        } else {
            console.log('✅ profile_pic column already exists.');
        }

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
};

migrate();
