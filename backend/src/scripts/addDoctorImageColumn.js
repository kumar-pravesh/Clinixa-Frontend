const mysql = require('mysql2/promise');
require('dotenv').config();

const addDoctorImageColumn = async () => {
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

        console.log('🔍 Checking for image_url column in doctors table...');

        // Check if column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'doctors' AND COLUMN_NAME = 'image_url'
        `, [process.env.DB_NAME || 'hospital_db']);

        if (columns.length > 0) {
            console.log('✅ Column image_url already exists. Skipping...');
        } else {
            console.log('🚀 Adding image_url column to doctors table...');
            await connection.query(`
                ALTER TABLE doctors
                ADD COLUMN image_url VARCHAR(255) DEFAULT NULL AFTER qualification
            `);
            console.log('✅ Column image_url added successfully!');
        }

    } catch (err) {
        console.error('❌ Error updating database:', err.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

addDoctorImageColumn();
