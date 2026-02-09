const mysql = require('mysql2/promise');
require('dotenv').config();

const fixSchema = async () => {
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

        // Check if columns exist
        const [columns] = await connection.query(`SHOW COLUMNS FROM patients LIKE 'dob'`);

        if (columns.length === 0) {
            console.log('Adding missing columns to patients table...');
            await connection.query(`
                ALTER TABLE patients 
                ADD COLUMN dob DATE,
                ADD COLUMN gender VARCHAR(20),
                ADD COLUMN phone VARCHAR(20),
                ADD COLUMN address TEXT,
                ADD COLUMN history TEXT;
            `);
            console.log('Columns added successfully.');
        } else {
            console.log('Columns already exist.');
        }

    } catch (err) {
        console.error('Error fixing schema:', err);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

fixSchema();
