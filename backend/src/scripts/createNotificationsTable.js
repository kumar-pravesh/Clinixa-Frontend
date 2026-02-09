const { pool } = require('../config/db');
require('dotenv').config();

const createNotificationsTable = async () => {
    try {
        console.log('Creating notifications table...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                related_id INT,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Notifications table created successfully.');
        process.exit();
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
};

createNotificationsTable();
