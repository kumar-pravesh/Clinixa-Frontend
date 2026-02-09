const mysql = require('mysql2/promise');
require('dotenv').config();

const addConsultationFee = async () => {
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

        // Check if column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'doctors' AND COLUMN_NAME = 'consultation_fee'
        `, [process.env.DB_NAME]);

        if (columns.length === 0) {
            console.log('Adding consultation_fee column...');
            await connection.query('ALTER TABLE doctors ADD COLUMN consultation_fee DECIMAL(10,2) DEFAULT 0.00');
            console.log('Column added successfully.');
        } else {
            console.log('Column consultation_fee already exists.');
        }

    } catch (err) {
        console.error('Error altering table:', err);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

addConsultationFee();
