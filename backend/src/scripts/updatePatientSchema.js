const mysql = require('mysql2/promise');
require('dotenv').config();

const migratePatientSchema = async () => {
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

        // Check if blood_group exists
        const [columns] = await connection.query(`SHOW COLUMNS FROM patients`);
        const columnNames = columns.map(c => c.Field);

        const adds = [];
        if (!columnNames.includes('blood_group')) {
            adds.push('ADD COLUMN blood_group VARCHAR(10)');
        }
        if (!columnNames.includes('status')) {
            adds.push("ADD COLUMN status VARCHAR(50) DEFAULT 'OPD'");
        }
        if (!columnNames.includes('clinical_condition')) {
            adds.push('ADD COLUMN clinical_condition VARCHAR(255)');
        }

        if (adds.length > 0) {
            console.log(`Adding missing columns: ${adds.join(', ')}`);
            await connection.query(`ALTER TABLE patients ${adds.join(', ')}`);
            console.log('Schema updated successfully.');
        } else {
            console.log('All columns already exist.');
        }

    } catch (err) {
        console.error('Error migrating patient schema:', err);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

migratePatientSchema();
