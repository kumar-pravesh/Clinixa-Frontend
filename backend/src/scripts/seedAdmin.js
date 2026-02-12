const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seedAdmin = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('Connected to MySQL...');

        const email = 'admin@clinixa.life';
        const password = 'Password@123'; // Standardized password for all test accounts

        // Check if admin exists
        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existing.length === 0) {
            console.log('Creating Admin user...');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            await connection.query(
                'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
                ['System Admin', email, passwordHash, 'admin', 'Active']
            );
            console.log(`Admin user created: ${email} / ${password}`);
        } else {
            console.log('Admin user already exists.');
        }

    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

seedAdmin();
